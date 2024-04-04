import { EventStoreDBClient } from "@eventstore/db-client";

export default function getEventStoreClient() {
  return EventStoreDBClient.connectionString(`${process.env.EVENT_STORE_CONN_STR}`)
}
