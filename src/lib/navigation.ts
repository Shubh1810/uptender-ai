/**
 * Full page load to an internal path.
 *
 * Use only right after the auth session changes (sign-in, onboarding
 * completion): a full load guarantees server components and the proxy see the
 * new session cookies. For everything else use `useRouter().push()`.
 */
export function hardNavigate(path: string) {
  window.location.assign(path);
}
