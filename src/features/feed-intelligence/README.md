# Feed Intelligence shell

This feature turns the Reader surface into the first executable slice of the SocioProphet feed-intelligence program.

## Product thesis

The Reader is not only a feed reader. It is a replayable knowledge refinery:

1. discover or subscribe to a source;
2. fetch and normalize an item;
3. resolve the item into a SlashTopics scope;
4. run the New Hope membrane decision;
5. attach MemoryMesh recall and review-only writeback posture;
6. prepare MeshRush graph views;
7. publish only derived views such as RSS, Atom, JSON Feed, or ActivityPub when policy allows.

RSS, Atom, JSON Feed, and ActivityPub are views. They are not the source of truth.

## Sequence contract

The first implementation sequence is deliberately narrow:

1. ticker proof of life;
2. feed subscription and source lanes;
3. normalized item reader;
4. right-side memex panel;
5. SlashTopics scope badge;
6. New Hope membrane badge;
7. MemoryMesh storage/recall posture;
8. MeshRush graph-view placeholder;
9. derived-publication placeholders.

## Stack boundary

- BearBrowser owns browser capture, feed discovery, page capture, and provenance emission.
- Socioprophet Web owns the reader, ticker, memex panel, and operator-facing workspace shell.
- SlashTopics owns public query/governance scopes.
- New Hope owns internal membrane admission: admit, hold, quarantine, reject.
- MemoryMesh owns scoped recall and review-only writeback posture after membrane admission.
- MeshRush owns graph traversal, diffusion, crystallization, and evidence structure.

## Acceptance criteria for this slice

- The `/reader` route renders a non-placeholder Feed Intelligence shell.
- The ticker displays normalized item state and can change the selected item.
- The source lane filters item state by source.
- The center item stream shows membrane status, topic scope, and provenance hash.
- The detail panel shows canonical URL, timestamps, storage posture, entities, and claims.
- The right rail shows the memex integration contract: SlashTopics, New Hope, MemoryMesh, and MeshRush.
- The event strip preserves the canonical event chain from discovery through publication placeholders.
- The integration grid distinguishes specified, wired, and pending surfaces.

## Non-goals for this slice

- No live network feed fetching.
- No ActivityPub server implementation.
- No MemoryMesh writeback.
- No MeshRush traversal execution.
- No BearBrowser native event bridge.

Those belong in follow-on repository PRs once the Vue shell has the correct product shape.
