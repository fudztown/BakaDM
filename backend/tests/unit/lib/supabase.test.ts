/**
 * @jest-environment node
 */
import { supabase } from "@/lib/supabase";

describe("Supabase Client", () => {
  it("should be defined", () => {
    expect(supabase).toBeDefined();
  });

  it("should have auth methods", () => {
    expect(supabase.auth).toBeDefined();
    expect(typeof supabase.auth.signInWithPassword).toBe("function");
    expect(typeof supabase.auth.signUp).toBe("function");
  });

  it("should have from method for queries", () => {
    expect(typeof supabase.from).toBe("function");
  });
});
