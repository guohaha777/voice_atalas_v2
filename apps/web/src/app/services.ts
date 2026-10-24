// The one place that chooses the implementation behind every port the pages use. Today: the mocks (mocks/) and the
// honest offline implementations. To connect the server, put the server adapters here and delete mocks/ — no page
// changes. Pages take these as their default implementations; tests pass their own.
import type {ComposeRepository} from '../pages/compose/services/composeRepository';
import {presetHintProvider} from '../pages/sound-birth/services/soundHints';
import type {SoundHintProvider} from '../pages/sound-birth/services/soundHints';
import {offlineMoodInterpreter} from '../pages/sound-world/services/moodInterpreter';
import type {MoodInterpreter} from '../pages/sound-world/services/moodInterpreter';
import type {SoundWorldRepository} from '../pages/sound-world/services/soundWorldRepository';
import type {ShelfRepository} from '../pages/works/services/shelfRepository';
import {offlineBackgroundGenerator} from '../shared/background/generator';
import type {BackgroundGenerator} from '../shared/background/generator';
import type {BackgroundLibrary} from '../shared/background/library';
import type {InspirationCatalog} from '../shared/inspiration/catalog';
import {mockServices} from '../mocks';

export type Services={
 soundHints:SoundHintProvider;
 soundWorldRepository:SoundWorldRepository;
 moodInterpreter:MoodInterpreter;
 composeRepository:ComposeRepository;
 shelfRepository:ShelfRepository;
 backgroundLibrary:BackgroundLibrary;
 backgroundGenerator:BackgroundGenerator;
 inspirationCatalog:InspirationCatalog;
};

export const services:Services={
 ...mockServices,
 // Offline, and saying so: preset hints, no model for mood words, AI background not open.
 soundHints:presetHintProvider,
 moodInterpreter:offlineMoodInterpreter,
 backgroundGenerator:offlineBackgroundGenerator,
};
