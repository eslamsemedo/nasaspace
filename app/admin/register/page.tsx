'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { User, Lock, Loader2 } from 'lucide-react'

function InlineAlert({ message }: { message: string }) {
  if (!message) return null
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {message}
    </div>
  )
}

// UI registration page with robust handleSubmit similar to your login page
// Schema: { email, password, fullName, roles } with roles: 0 = Admin, 1 = Judge
const Page = () => {
  type RegisterPayload = {
    email: string
    password: string
    fullName: string
    roles: 0 | 1
  }

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // where to go after successful registration
  // if your API logs the user in, send them to /admin/home; otherwise maybe /auth/login
  const next = '/admin/home'

  async function submitRegister(payload: RegisterPayload) {
    setLoading(true)
    setError(null)

    // quick client-side validation (optional)
    if (!payload.email.trim() || !payload.password || !payload.fullName.trim()) {
      setError('All fields are required.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      // handle non-2xx with best-effort error extraction
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Registration failed' }))
        // your backend sometimes returns error as JSON-stringified object like in login page
        let message = typeof data?.error === 'string' ? data.error : (data?.message || 'Registration failed')
        // if the error is a JSON string, try to parse { message }
        try {
          const parsed = JSON.parse(message)
          if (parsed?.message) message = parsed.message
        } catch {}
        setError(message)
        return
      }

      const body = (await res.json().catch(() => ({}))) as {
        succeeded?: boolean
        error?: string
        message?: string
      }

      if (body?.succeeded === false) {
        setError(body?.error || body?.message || 'Registration failed')
        return
      }

      // Success — redirect and refresh (mirrors your login pattern)
      router.replace(next)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const payload: RegisterPayload = {
      email: String(data.get('email') || ''),
      password: String(data.get('password') || ''),
      fullName: String(data.get('fullName') || ''),
      roles: Number(data.get('roles')) as 0 | 1,
    }
    // UI-only log
    console.log('register payload', payload)
    submitRegister(payload)
  }

  return (
    <div className="min-h-svh grid place-items-center bg-[radial-gradient(50%_50%_at_50%_0%,hsl(var(--primary)/0.18)_0%,transparent_65%)] from-primary/20 to-background p-4">
      <div className="relative w-full max-w-sm perspective-[1200px]">
        <div className="pointer-events-none absolute -top-10 -left-8 h-24 w-24 rounded-full bg-primary/15 blur-xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-muted/60 blur-2xl" />

        <div className="[transform:translateZ(0)]">
          <Card className="w-full border border-border/60 shadow-xl/20 backdrop-blur-md bg-card/70 hover:shadow-2xl [transform:translateZ(60px)] rounded-2xl">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground" style={{ transform: 'translateZ(24px)' }}>
                <div className="rounded-xl bg-primary/10 p-2">
                  <User className="h-5 w-5" />
                </div>
                <span className="text-sm">Create your account</span>
              </div>
              <CardTitle style={{ transform: 'translateZ(20px)' }}>Register</CardTitle>
              <CardDescription style={{ transform: 'translateZ(16px)' }}>
                Fill in your details to get started.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && <InlineAlert message={error} />}
              <form className="grid gap-4" onSubmit={handleSubmit}>
                {/* fullName */}
                <div className="grid gap-2" style={{ transform: 'translateZ(12px)' }}>
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" name="fullName" placeholder="Jane Doe" autoComplete="name" required />
                </div>

                {/* email */}
                <div className="grid gap-2" style={{ transform: 'translateZ(12px)' }}>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" name="email" placeholder="jane@example.com" autoComplete="email" required />
                </div>

                {/* password */}
                <div className="grid gap-2" style={{ transform: 'translateZ(12px)' }}>
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative">
                    <Input id="reg-password" name="password" type="password" placeholder="••••••••" autoComplete="new-password" required />
                    <Lock className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-input"
                        onChange={(e) => {
                          const input = e.currentTarget.form?.elements.namedItem('password') as HTMLInputElement | null
                          if (input) input.type = e.currentTarget.checked ? 'text' : 'password'
                        }}
                      />
                      Show password
                    </label>
                  </div>
                </div>

                {/* roles: 0 admin, 1 judge */}
                <div className="grid gap-2" style={{ transform: 'translateZ(12px)' }}>
                  <Label>Role</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 rounded-xl border border-border/60 p-3 hover:bg-muted cursor-pointer">
                      <input type="radio" name="roles" value={0} defaultChecked />
                      <span className="text-sm">Admin</span>
                    </label>
                    <label className="flex items-center gap-2 rounded-xl border border-border/60 p-3 hover:bg-muted cursor-pointer">
                      <input type="radio" name="roles" value={1} />
                      <span className="text-sm">Judge</span>
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className={`w-full bg-[#5d89e1] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                  style={{ transform: 'translateZ(14px)' }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    'Create account'
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="text-center text-sm text-muted-foreground">
              <p className="w-full" style={{ transform: 'translateZ(8px)' }}>
                By continuing you agree to our Terms and Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page
