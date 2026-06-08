export function extractNotificationLogs(payload) {
  if (!payload) return [];

  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload.data)) return payload.data;

  if (Array.isArray(payload.data?.data)) return payload.data.data;

  return [];
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export function filterNotificationsForUser(logs, userEmail) {
  const targetEmail = normalizeEmail(userEmail);

  if (!targetEmail) return logs;

  return logs.filter((log) => {
    const candidates = [
      log?.recipient_email,
      log?.email,
      log?.to,
      log?.receiver_email,
      log?.recipient?.email,
      log?.user?.email
    ];

    return candidates.some((candidate) => normalizeEmail(candidate) === targetEmail);
  });
}
