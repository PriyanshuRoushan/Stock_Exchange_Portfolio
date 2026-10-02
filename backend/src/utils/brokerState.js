import jwt from "jsonwebtoken";

const STATE_TTL = "10m";

export const createBrokerState = ({ userId, broker }) =>
  jwt.sign({ userId, broker, purpose: "broker-oauth" }, process.env.JWT_SECRET, {
    expiresIn: STATE_TTL,
  });

export const readBrokerState = (state, broker) => {
  if (!state) throw new Error("Missing OAuth state");

  const payload = jwt.verify(state, process.env.JWT_SECRET);
  if (payload.purpose !== "broker-oauth" || payload.broker !== broker || !payload.userId) {
    throw new Error("Invalid OAuth state");
  }

  return payload;
};
