export default {
  Records: [
    {
      messageId: "...",
      receiptHandle: "...",
      body: JSON.stringify({
        url: "https://example.com/images/photo.png",
        projectId: "e37ef498-d8f7-43d2-bd33-52dacf0c9024",
        sessionId: "002cdfdf-c41d-404c-bc97-16e8c6d390cd",
      }),
      attributes: {
        ApproximateReceiveCount: "1",
        SentTimestamp: "...",
        SenderId: "...",
        ApproximateFirstReceiveTimestamp: "...",
      },
      messageAttributes: {},
      md5OfBody: "...",
      eventSource: "aws:sqs",
      eventSourceARN: "...",
      awsRegion: "eu-west-1",
    },
  ],
};
