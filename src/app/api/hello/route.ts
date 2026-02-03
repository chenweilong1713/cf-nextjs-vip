export async function GET(request: Request) {
  // 从请求中获取查询参数（例如 /api/hello?name=张三）
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || '匿名用户';

  // 返回 JSON 响应
  return Response.json({
    code: 200,
    message: '请求成功',
    data: {
      greeting: `你好，${name}！这是 Next.js App Router 的 GET 接口`,
      time: new Date().toLocaleString()
    }
  });
}