export const broadcastUpdate = (wss, trolleyId, data) => {
    wss.clients.forEach(client => {
      if (client.trolleyId === trolleyId && client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  };