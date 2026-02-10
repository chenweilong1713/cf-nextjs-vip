import { getCloudflareContext } from '@opennextjs/cloudflare';
import { success, error, jsonResponse } from '@/lib/utils/response';

export async function GET(request: Request) {
    try {
        const { env } = await getCloudflareContext();
        const db = (env as CloudflareEnv).DB;

        // 1. Summary Cards
        const totalMembersResult = await db.prepare('SELECT COUNT(*) as count FROM members').first<{ count: number }>();
        const totalMembers = totalMembersResult?.count || 0;

        // Today's Sales (Balance Consumption)
        // Using date('now') which is UTC. Adjust if needed.
        const todaySalesResult = await db.prepare(`
            SELECT SUM(ABS(amount)) as total 
            FROM transactions 
            WHERE type = 'balance' 
            AND amount < 0 
            AND date(created_at) = date('now')
        `).first<{ total: number }>();
        const todaySales = todaySalesResult?.total || 0;

        const totalPointsResult = await db.prepare('SELECT SUM(points) as total FROM members').first<{ total: number }>();
        const totalPoints = totalPointsResult?.total || 0;

        // Active Members (Transactions in last 7 days)
        const activeMembersResult = await db.prepare(`
            SELECT COUNT(DISTINCT member_id) as count 
            FROM transactions 
            WHERE created_at >= date('now', '-7 days')
        `).first<{ count: number }>();
        const activeMembersCount = activeMembersResult?.count || 0;
        const activeRate = totalMembers > 0 ? ((activeMembersCount / totalMembers) * 100).toFixed(1) : 0;

        // 2. Member Growth (Last 7 Days)
        const memberGrowthResult = await db.prepare(`
            SELECT date(created_at) as date, COUNT(*) as count 
            FROM members 
            WHERE created_at >= date('now', '-6 days') 
            GROUP BY date(created_at) 
            ORDER BY date(created_at)
        `).all<{ date: string, count: number }>();

        // Fill missing dates
        const memberGrowthData = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const found = memberGrowthResult.results.find(r => r.date === dateStr);
            memberGrowthData.push({
                date: dateStr,
                count: found ? found.count : 0
            });
        }

        // 3. Transaction Volume (Last 7 Days)
        const transactionVolumeResult = await db.prepare(`
            SELECT 
                date(created_at) as date,
                SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as recharge,
                SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as consumption
            FROM transactions 
            WHERE type = 'balance' 
            AND created_at >= date('now', '-6 days')
            GROUP BY date(created_at)
            ORDER BY date(created_at)
        `).all<{ date: string, recharge: number, consumption: number }>();

        const transactionData = {
            dates: [],
            recharge: [],
            consumption: []
        };
        
        // Fill dates for transactions too
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const found = transactionVolumeResult.results.find(r => r.date === dateStr);
            // @ts-ignore
            transactionData.dates.push(dateStr);
            // @ts-ignore
            transactionData.recharge.push(found ? found.recharge : 0);
            // @ts-ignore
            transactionData.consumption.push(found ? found.consumption : 0); // Consumption as positive for bar chart
        }

        // 4. Member Level Distribution
        const levelResult = await db.prepare(`
            SELECT 
                CASE 
                    WHEN points < 1000 THEN '普通会员'
                    WHEN points < 5000 THEN 'Pro 会员'
                    ELSE 'Max 会员'
                END as level,
                COUNT(*) as count
            FROM members
            GROUP BY level
        `).all<{ level: string, count: number }>();

        // 5. Points Activity (Radar) - Last 30 days
        // Simplify to just a few categories based on remark matching
        // Since we generated remarks: '签到', '消费赠送', '活动奖励', '积分兑换'
        const pointsActivityResult = await db.prepare(`
            SELECT remark, COUNT(*) as count 
            FROM transactions 
            WHERE type = 'points' 
            AND created_at >= date('now', '-30 days')
            GROUP BY remark
        `).all<{ remark: string, count: number }>();

        const radarIndicator = [
            { name: '签到', max: 0 },
            { name: '消费赠送', max: 0 },
            { name: '活动奖励', max: 0 },
            { name: '积分兑换', max: 0 }
        ];
        
        const radarDataValues = [0, 0, 0, 0];
        let maxVal = 0;

        pointsActivityResult.results.forEach(r => {
            const idx = radarIndicator.findIndex(i => r.remark.includes(i.name));
            if (idx !== -1) {
                radarDataValues[idx] += r.count;
                if (radarDataValues[idx] > maxVal) maxVal = radarDataValues[idx];
            }
        });

        // Update max for radar
        radarIndicator.forEach(i => i.max = maxVal + 10);

        return jsonResponse(success({
            summary: {
                totalMembers,
                todaySales,
                totalPoints,
                activeRate
            },
            charts: {
                memberGrowth: memberGrowthData,
                transactionVolume: transactionData,
                memberLevel: levelResult.results,
                pointsActivity: {
                    indicator: radarIndicator,
                    data: radarDataValues
                }
            }
        }));

    } catch (e: any) {
        console.error('Stats error:', e);
        return jsonResponse(error(500, e.message), 500);
    }
}
