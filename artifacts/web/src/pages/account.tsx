import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, User, Mail, Phone, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";

export default function AccountPage() {
  const { user, loading, refreshUser, logout } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg("");
    try {
      await apiFetch("/auth/me", {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
        }),
      });
      await refreshUser();
      setProfileMsg("Profile updated successfully");
      setName("");
      setPhone("");
    } catch (err: unknown) {
      setProfileMsg(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPw(true);
    setPwMsg("");
    try {
      await apiFetch("/auth/change-password", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPwMsg("Password changed. Please sign in again.");
      setTimeout(() => logout(), 2000);
    } catch (err: unknown) {
      setPwMsg(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setChangingPw(false);
    }
  };

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <h2 className="text-2xl font-black text-foreground mb-4">Sign in to view your account</h2>
          <Link href="/login">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <Header />
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-black text-foreground">Account</h1>
        </div>

        {user && (
          <div className="bg-card border border-card-border rounded-2xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-black text-primary">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="font-black text-foreground text-lg">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        )}

        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h2 className="text-base font-bold text-foreground mb-4">Update Profile</h2>
          {profileMsg && (
            <div className={`mb-4 flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${profileMsg.includes("success") ? "bg-green-50 text-green-700" : "bg-destructive/10 text-destructive"}`}>
              {profileMsg.includes("success") && <CheckCircle2 className="w-4 h-4" />}
              {profileMsg}
            </div>
          )}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={user?.name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder={user?.phone ?? "+1 555 000 0000"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving || (!name.trim() && !phone.trim())}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h2 className="text-base font-bold text-foreground mb-4">Change Password</h2>
          {pwMsg && (
            <div className={`mb-4 text-sm px-4 py-3 rounded-xl ${pwMsg.includes("changed") ? "bg-green-50 text-green-700" : "bg-destructive/10 text-destructive"}`}>
              {pwMsg}
            </div>
          )}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Min 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={changingPw || !currentPassword || newPassword.length < 8}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {changingPw ? <><Loader2 className="w-4 h-4 animate-spin" />Changing…</> : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
