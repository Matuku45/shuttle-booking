# TODO: Fix CORS, Connection Errors, and Ensure Booking Completes Even If Payment Fails

## Tasks
- [x] Update fetchShuttles in PassengerDashboard.jsx to use '/api/shuttles' instead of full production URL to leverage Vite proxy and avoid CORS.
- [x] Change booking API fetch in handleBooking to use production URL (e.g., `${BASE_URL}/api/bookings`) since localhost:3001 isn't running.
- [x] Modify handleBooking to save booking locally first, then attempt API call and payment, but proceed with booking completion regardless of failures.
- [x] Add one dummy booking to AllBookings.jsx for testing purposes.

## Followup Steps
- [ ] Test the application to ensure shuttles load without CORS errors.
- [ ] Test booking process: booking should save locally and proceed even if API or payment fails.
- [ ] Verify dummy booking appears in AllBookings for testing.
