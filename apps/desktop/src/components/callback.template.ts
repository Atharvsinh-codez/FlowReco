export default `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <title>FlowReco Sign-in</title>
  <style>
    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      font-weight: 400;
    }
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      text-align: center;
      background-color: #f4f5f6;
    }
    .container {
      width: min(100% - 48px, 400px);
      padding: 30px;
      margin: 0 auto;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      color: #111315;
      font-size: 30px;
      font-weight: 650;
      letter-spacing: -0.04em;
    }
    .logo {
      width: 48px;
      height: 48px;
    }
    p {
      margin: 0;
      color: #202328;
      font-size: 18px;
      line-height: 1.5;
    }
    .error {
      margin-top: 12px;
      color: #b42331;
      font-size: 15px;
    }
  </style>
</head>
<body>
  <main class="container">
    <div class="brand" aria-label="FlowReco">
      <svg class="logo" viewBox="0 0 1024 1024" role="img" aria-label="FlowReco app mark" xmlns="http://www.w3.org/2000/svg">
        <rect x="32" y="32" width="960" height="960" rx="224" fill="#111315" />
        <path d="M390 246H310c-35.346 0-64 28.654-64 64v80" fill="none" stroke="#F4F5F6" stroke-width="62" stroke-linecap="round" />
        <path d="M634 246h80c35.346 0 64 28.654 64 64v80" fill="none" stroke="#F4F5F6" stroke-width="62" stroke-linecap="round" />
        <path d="M778 634v80c0 35.346-28.654 64-64 64h-80" fill="none" stroke="#F4F5F6" stroke-width="62" stroke-linecap="round" />
        <path d="M390 778h-80c-35.346 0-64-28.654-64-64v-80" fill="none" stroke="#F4F5F6" stroke-width="62" stroke-linecap="round" />
        <path d="M402 674V350h142c82 0 130 42 130 117 0 76-54 112-130 112H402m139 0 137 95" fill="none" stroke="#FF6243" stroke-width="70" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span>FlowReco</span>
    </div>
    <p id="message">You're signed in. Reopen the FlowReco desktop app to continue.</p>
    <div id="error-container"></div>
  </main>
</body>
</html>
`;
