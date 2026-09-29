import {loginAdmin} from '../actions'

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{error?: string}>
}) {
  const {error} = await searchParams

  return (
    <div className="admin-wrap">
      <h1>Admin</h1>
      <p className="admin-note">Sign in to edit covers.</p>
      {error ? <p className="admin-error">Wrong password.</p> : null}
      <form className="admin-form" action={loginAdmin}>
        <label>
          Password
          <input name="password" type="password" required autoFocus />
        </label>
        <div className="admin-actions">
          <button type="submit">Sign in</button>
        </div>
      </form>
    </div>
  )
}
