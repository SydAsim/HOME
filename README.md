# Courtyard Residence

A self-contained, furnished 3D home concept on an assumed square 1,836 sq ft plot.

The home contains a basement, ground floor, first floor and roof terrace. Each main floor has two bedrooms with private attached bathrooms, one enclosed kitchen and a 12 × 12.5 ft TV lounge and a 8.5 × 9 ft open four-seat dining area. The basement has a social lounge, cinema, study, prayer room, full bathroom and service closet. A compact car bay becomes a covered balcony on the first floor.

## Run

Serve `dist` with any static HTTP server. The hosting manifest points to `dist`; no build or external CDN is required. Three.js 0.180.0 is vendored under `dist/vendor`, with its MIT license.

`node scripts/check-model.mjs` checks room counts, dimensions, openings, finite geometry, entry points and navigable connections through the modelled doorways.

## Controls

- Dollhouse: drag to orbit; wheel or +/- buttons to zoom; click a room label or sidebar entry to focus it.
- Walkthrough: drag to look, WASD/arrow keys to move, Esc to leave. Use the floor selector, E or Q to change levels. Movement includes wall and bed/stair collision limits; room selection also provides direct entry.
- Floor plan: click any room for its dimensions. Design notes include a current-floor SVG download.
- Exterior: see both main floors and the roof together. Basement is shown separately.
- Guided tour: twelve stops with pause, next and close controls.

The application uses WebGL when available. A CPU triangle rasterizer provides real, depth-buffered 3D from the same geometry when WebGL is disabled. Hardware rendering includes soft shadows and local lighting; the software path uses simpler shading.

## Design status

This is a spatial concept, not an approved building, structural or services plan. The square plot and south-facing road are assumptions. Building envelope: 42.5 × 32 ft. Two bedroom clear sizes per main floor are about 13.5 × 12.5 ft and 13 × 12.5 ft. The upper covered balcony is over the car bay. The proposed stair head has about 118 sq ft gross area. Estimated covered/enclosed above-ground area is about 2,838 sq ft before authority-specific measurement.

Actual survey, setbacks, plot jurisdiction, FAR, ventilation, stair headroom, excavation support, retaining structures, seismic design, roof loads, basement drainage and emergency escape design need local professional approval. The rear garden strip and basement court have been removed. A replacement compliant basement escape route and ventilation plan are required before construction. Internal kitchen/bathroom ventilation must be engineered. Confirm prayer direction for the actual location.

Reference reviewed: [PDA Building Control Regulations 2024](https://pda.kp.gov.pk/uploads/downloads/pdf-attchment-eb8ee58e1da100cb9601e30fce2aaed4.pdf). This is one family home with two kitchens, not two separately approved residential units.

Boundary revision: the house now sits against the rear boundary in the spatial concept; the former rear strip is reassigned to a front courtyard within the same 1,836 sq ft plot. Continuous capped boundary walls enclose the plot. A separate 4.5 ft pedestrian gate aligns with the widened 4.5 ft house entrance, beside the original vehicle gate. Exterior mode includes an open/close control for the second gate. Rear-facing windows are removed. Side-window daylight and ventilation and the rear setback require local design review.

Interior rearrangement: both main floors retain their stacked bathrooms and stair, while the enclosed kitchens move to the front-right (9.5 × 12.5 ft). The old kitchen becomes open dining. The TV lounge is reoriented toward the new kitchen partition. Bedrooms have side-wall headboards and repositioned fitted wardrobes; primary entries move toward the right-hand side of the bedroom corridor.

Four comparable design options: the sidebar Design 1–4 buttons rebuild the furnished 3D scene, room metadata, floor plans, labels, collisions and guided-tour destinations for the same house. Designs 1/3 use the front kitchen; Designs 2/4 use the central kitchen. Bed orientations, lounge arrangements and basement zoning also vary. Every main floor retains two ensuite bedrooms, a separate kitchen, parking/balcony and the aligned stair. All options provide a furniture-free gallery 13 × 6.5 ft between the bedroom and front spaces. The choice is remembered in browser-local storage. The roof, plot and boundary/gates stay fixed.

Full placement alternatives supersede the earlier furniture comparison. Design 1 uses rear corner bedrooms, rear-centre ensuites and a front-right kitchen. Design 2 uses centre/right bedrooms, a rear-left kitchen, one forward ensuite and a front-right lounge. Design 3 places bedrooms along the middle sides, bathrooms behind them and a vertical central gallery beside a left galley kitchen. Design 4 shifts the bedrooms farther forward, enlarges the rear bathrooms, places the kitchen across the rear centre and gives the front to the TV lounge. All walls, doorways, fixtures, plans, furniture and walk destinations use the active floor geometry. Parking shifts forward within the unchanged plot for Designs 3/4. Ground/first wet areas remain stacked within each design. The central bedroom in Design 2 needs an architect-designed daylight/ventilation solution before it could become a construction plan.

Design 5 adds opposite side bedrooms (R1/R2), a single 22 × 11.25 ft TV lounge/dining room, a 13.5 × 9 ft enclosed kitchen, a 6.5 ft wide main passage and a 6.5 × 5.25 ft turning kitchen lobby. The solid kitchen door remains closed from guest seating and opens automatically on approach during the walkthrough. Both bedrooms keep direct private ensuites and are reached through circulation rather than the kitchen. Basement Design 4, roof, boundary and gates are retained.
