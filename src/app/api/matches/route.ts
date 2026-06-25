import { NextResponse } from 'next/server';
import { fetchLiveMatches } from '@/services/dataService';

export async function GET() {
  try {
    const data = await fetchLiveMatches();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching live matches:', error);
    return NextResponse.json({ error: 'Failed to fetch live matches' }, { status: 500 });
  }
}
