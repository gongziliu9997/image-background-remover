import { NextRequest, NextResponse } from 'next/server';

// Configure Edge Runtime for Cloudflare Pages compatibility
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided', code: 'NO_IMAGE' },
        { status: 400 }
      );
    }

    // 文件类型校验
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload JPG, PNG, or WEBP.', code: 'INVALID_FILE_TYPE' },
        { status: 400 }
      );
    }

    // 文件大小校验免（10MB）
    const maxSize = 10 * 1024 * 1024;
    if (image.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.', code: 'FILE_TOO_LARGE' },
        { status: 400 }
      );
    }

    // 获取 API Key
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', code: 'NO_API_KEY' },
        { status: 500 }
      );
    }

    // 调用 Remove.bg API
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', image);
    removeBgFormData.append('size', 'auto');
    // 优化参数
    removeBgFormData.append('type', 'person'); // 指定为人物照片（更精确的算法）
    removeBgFormData.append('type_level', '2'); // 最高精密度（0=快速，1=平衡，2=精准）
    removeBgFormData.append('shadow', '1'); // 软阴影效果（0=无，1=软，2=强）
    removeBgFormData.append('channels', 'rgba'); // 使用 RGBA 通道（支持透明度）
    removeBgFormData.append('semitransparency', '1'); // 保留半透明区域

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      if (response.status === 402) {
        return NextResponse.json(
          { error: 'Insufficient credits. Please upgrade your Remove.bg plan.', code: 'INSUFFICIENT_CREDITS' },
          { status: 402 }
        );
      }

      const errorText = await response.text();
      console.error('Remove.bg API error:', errorText);
      
      return NextResponse.json(
        { error: 'Failed to remove background. Please try again.', code: 'API_ERROR' },
        { status: response.status }
      );
    }

    // 返回处理后的图片（流式传输）
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="removed-bg-${Date.now()}.png"`,
      },
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
