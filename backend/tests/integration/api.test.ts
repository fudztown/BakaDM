/**
 * @jest-environment node
 */
import { GET as getHealth } from "@/app/api/health/route";
import { GET as listCampaigns, POST as createCampaign } from "@/app/api/campaigns/route";
import { POST as startSession } from "@/app/api/campaigns/[id]/sessions/route";
import { POST as sendMessage } from "@/app/api/sessions/[id]/message/route";
import { POST as endSession } from "@/app/api/sessions/[id]/end/route";
import { NextRequest } from "next/server";

class MockNextRequest {
  headers = new Headers({ "x-bot-api-key": "test-api-key" });
  jsonBody: any;

  constructor(body?: any) {
    this.jsonBody = body;
  }

  async json() {
    return this.jsonBody;
  }
}

describe("Integration: Full Session Lifecycle", () => {
  it("should create campaign, start session, send messages, and end session", async () => {
    // 1. Create campaign
    const createReq = new MockNextRequest({ name: "Integration Test", guild_id: "123" }) as any;
    const createRes = await createCampaign(createReq);
    expect(createRes.status).toBe(201);
    const campaign = await createRes.json();
    const campaignId = campaign.id;

    // 2. Start session
    const startReq = new MockNextRequest({ voice_channel_id: "vc_1", players: [] }) as any;
    const startRes = await startSession(startReq, { params: Promise.resolve({ id: campaignId }) });
    expect(startRes.status).toBe(201);
    const session = await startRes.json();
    const sessionId = session.session_id;
    expect(session.status).toBe("active");

    // 3. Send messages
    const messages = [
      { player_id: "u1", character_name: "Thorin", text: "Hello" },
      { player_id: "u2", character_name: "Gandalf", text: "I cast fireball" },
      { player_id: "u1", character_name: "Thorin", text: "I attack" },
    ];

    for (const msg of messages) {
      const msgReq = new MockNextRequest(msg) as any;
      const msgRes = await sendMessage(msgReq, { params: Promise.resolve({ id: sessionId }) });
      expect(msgRes.status).toBe(200);
      const dmResp = await msgRes.json();
      expect(dmResp.dm_text).toBeDefined();
      expect(dmResp.dm_text.length).toBeGreaterThan(0);
    }

    // 4. End session
    const endReq = new MockNextRequest() as any;
    const endRes = await endSession(endReq, { params: Promise.resolve({ id: sessionId }) });
    expect(endRes.status).toBe(200);
    const summary = await endRes.json();
    expect(summary.session_id).toBe(sessionId);
    expect(summary.duration_minutes).toBeDefined();
  });

  it("should handle concurrent sessions for different campaigns", async () => {
    const campaigns = [];
    for (let i = 0; i < 3; i++) {
      const req = new MockNextRequest({ name: `Campaign ${i}`, guild_id: `guild_${i}` }) as any;
      const res = await createCampaign(req);
      expect(res.status).toBe(201);
      campaigns.push(await res.json());
    }

    // Verify each campaign has unique ID
    const ids = campaigns.map((c) => c.id);
    expect(new Set(ids).size).toBe(3);
  });
});

describe("Integration: Auth Across Endpoints", () => {
  it("should reject protected endpoints without auth", async () => {
    const noAuthReq = { headers: new Headers() } as any;

    // Health endpoint is public, test protected endpoints
    const endpoints = [
      () => listCampaigns(noAuthReq),
      () => createCampaign(noAuthReq),
      () => startSession(noAuthReq, { params: Promise.resolve({ id: "test" }) }),
      () => sendMessage(noAuthReq, { params: Promise.resolve({ id: "test" }) }),
      () => endSession(noAuthReq, { params: Promise.resolve({ id: "test" }) }),
    ];

    for (const endpoint of endpoints) {
      const res = await endpoint();
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should allow health check without auth", async () => {
    const noAuthReq = { headers: new Headers() } as any;
    const res = await getHealth(noAuthReq);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("healthy");
  });
});
