import type { CommMessage } from "@/lib/types";

export const mockComms: CommMessage[] = [
  {
    type: "EVAC ALERT",
    body: "Zone A evacuation advisory issued. All residents south of Gandy Blvd should move to designated shelters immediately. Hillsborough HS and Middleton HS accepting evacuees.",
    time: "08:45",
    priority: "high",
  },
  {
    type: "ROAD CLOSURE",
    body: "Gandy Blvd closed between Westshore Blvd and Dale Mabry Hwy due to storm surge debris. Use Courtney Campbell Causeway as alternate east-west route.",
    time: "09:12",
    priority: "medium",
  },
  {
    type: "SHELTER UPDATE",
    body: "Hillsborough HS shelter at 120% capacity. Redirecting overflow to Middleton HS (42% capacity). Transport assistance available — call 211.",
    time: "09:38",
    priority: "medium",
  },
];
