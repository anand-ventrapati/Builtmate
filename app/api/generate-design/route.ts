import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert architectural designer. Given a house description, provide a structured architectural JSON response with: title, description, estimated_cost_range (in INR), key_features (array), and suggested_materials (array). Be creative and professional.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama3-8b-8192',
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Groq AI Error:', error);
    return NextResponse.json({ error: 'Failed to generate design' }, { status: 500 });
  }
}
