# identify-assets

Ah, what a tease... We've removed the (fairly gnarly) asset parser code and corresponding queues/topics for this demo.

In short, this handler is responsible for processing SNS notifications relating to DOM mutation `events`, buffered into an SQS queue.

If a stylesheet/image assets is found in the `event` payload the `stylesheet-discovered-$env`/`image-discovered-$env` SNS topics gets notified.

The SNS notifications then get buffers into an SQS queue and eventually gets processed by `ingest-assets.handler`.
