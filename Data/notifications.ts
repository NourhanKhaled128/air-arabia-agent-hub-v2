export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export const notifications: Notification[] = [
  {
    id: 1,
    title: "Refund Policy Updated",
    message: "Refund procedure has been updated.",
    time: "10 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Summer Schedule",
    message: "New schedule is now available.",
    time: "Today",
    unread: true,
  },
  {
    id: 3,
    title: "Payment Procedure",
    message: "Payment policy revised.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 4,
    title: "Ancillary Services",
    message: "New baggage options added.",
    time: "2 days ago",
    unread: false,
  },
];