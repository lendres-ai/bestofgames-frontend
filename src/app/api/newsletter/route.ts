import { NextRequest, NextResponse } from 'next/server';

const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY;
const BUTTONDOWN_API_URL = 'https://api.buttondown.email/v1/subscribers';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // If no API key is configured, just succeed (for development)
        if (!BUTTONDOWN_API_KEY) {
            console.log('Newsletter signup (no API key configured):', email);
            return NextResponse.json({ success: true });
        }

        // Subscribe via Buttondown API
        const response = await fetch(BUTTONDOWN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${BUTTONDOWN_API_KEY}`,
            },
            body: JSON.stringify({
                email_address: email,
                tags: ['website-signup'],
            }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));

            // Handle already subscribed
            if (response.status === 400 && data.code === 'email_already_exists') {
                return NextResponse.json({ success: true, message: 'Already subscribed' });
            }

            console.error('Buttondown API error:', data);
            return NextResponse.json(
                { error: data.detail || 'Subscription failed' },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
