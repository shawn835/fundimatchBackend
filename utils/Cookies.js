export function setCookie(res, name, value) {
  const cookieOptions = [
    `${name}=${value}`,
    'HttpOnly',
    'Path=/',
    `Max-Age=${process.env.COOKIE_MAX_AGE || 3600}`,
  ];

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.push('Secure', 'SameSite=None');
  } else {
    // Localhost dev
    cookieOptions.push('SameSite=Lax');
  }

  res.setHeader('Set-Cookie', cookieOptions.join('; '));
}

export function clearCookie(res, name) {
  const cookieOptions = [
    `${name}=; HttpOnly; Path=/; Max-Age=0`,
    process.env.NODE_ENV === 'production'
      ? 'Secure; SameSite=None'
      : 'SameSite=Lax',
  ];

  res.setHeader('Set-Cookie', cookieOptions.join('; '));
}
