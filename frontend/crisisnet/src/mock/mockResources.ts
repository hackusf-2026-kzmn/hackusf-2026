import type { Resource } from "@/lib/types";

export const mockResources: Resource[] = [
  {
    name: "FEMA Individual Assistance",
    type: "shelter",
    address: "Tampa Bay, FL",
    lat: "27.9506",
    lng: "-82.4572",
    distance_km: "0.5",
  },
  {
    name: "Red Cross Emergency Shelter",
    type: "shelter",
    address: "Tampa, FL",
    lat: "27.9475",
    lng: "-82.4584",
    distance_km: "1.2",
  },
  {
    name: "Florida Disaster Fund",
    type: "shelter",
    address: "Pinellas County, FL",
    lat: "27.8765",
    lng: "-82.7815",
    distance_km: "3.0",
  },
  {
    name: "Feeding Tampa Bay",
    type: "shelter",
    address: "Hillsborough County, FL",
    lat: "28.0587",
    lng: "-82.414",
    distance_km: "2.1",
  },
];
