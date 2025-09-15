// src/app/lib/types.ts
export type Media = { url: string; alt?: string };

export type Owner = {
  name: string;
  email: string;
  avatar?: string | null;
};

export type Venue = {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta?: { wifi?: boolean; parking?: boolean; breakfast?: boolean; pets?: boolean };
  location?: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    continent?: string;
    lat?: number;
    lng?: number;
  };
  owner?: Owner;
};

export type VenueWithBookings = Venue & {
  bookings?: BookingWithVenue[];
};

export type VenueWithExtras = Venue & {
  owner?: Owner;
  bookings?: Booking[];
};

export type Booking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  customer?: {
    name: string;
    email: string;
    avatar?: { url?: string; alt?: string } | null;
  };
};

export type BookingWithVenue = Booking & {
  venue?: Pick<Venue, "id" | "name" | "media" | "location" | "price" | "maxGuests"> | null;
};

export type Profile = {
  name: string;
  email?: string;
  bio?: string;
  avatar?: { url?: string; alt?: string } | null;
  banner?: { url?: string; alt?: string } | null;
  venueManager?: boolean;
  venues?: VenueWithBookings[];
  bookings?: BookingWithVenue[];
  _count?: { venues?: number; bookings?: number };
};

export type Paged<T> = {
  data: T[];
  meta: {
    isFirstPage: boolean;
    isLastPage: boolean;
    currentPage: number;
    previousPage: number | null;
    nextPage: number | null;
    pageCount: number;
    totalCount: number;
  };
};

export type PaginationMeta = {
  currentPage: number;
  pageCount: number;
  totalCount: number;
  nextPage?: number | null;
  previousPage?: number | null;
  pageSize?: number;
};
