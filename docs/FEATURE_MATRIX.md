# FlowReco feature matrix

**Snapshot:** 2026-07-14. This inventory combines the product brief with user-visible capabilities found in the pinned Cap and Recordly repositories. “Implemented” means a usable code path and relevant source-level evidence exist; it does not waive native/platform release testing. “Partial” means meaningful foundation work exists but required behavior or verification remains. “Blocked” identifies an environmental release-verification blocker rather than abandoned scope.

Status counts should be recalculated before each milestone sign-off. The detailed evidence ledger is [TEST_REPORT.md](TEST_REPORT.md).

## Recording and recovery

| Feature | Cap support | Recordly support | Reco target (FlowReco) | Chosen implementation | Source/provenance | Status | Tests | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Entire-display capture | Yes | Yes | Required | Cap native capture crates | Cap | Partial | Native matrix blocked | Needs macOS/Windows validation |
| Application-window capture | Yes | Yes | Required | Cap target enumeration/capture | Cap | Partial | Native matrix blocked | Verify moved/resized/occluded windows |
| Selected-region capture | Yes | Partial | Required | Cap region selection and coordinate model | Cap | Partial | Native matrix blocked | DPI/multidisplay cases pending |
| Capture source preview | Yes | Yes | Required | Solid recorder preview | Cap | Partial | UI source checks | Packaged device test pending |
| Instant Mode | Yes | No | Required | Cap progressive/local recording mode | Cap | Partial | Network E2E pending | Local copy must remain authoritative |
| Studio Mode | Yes | Yes | Required | Cap local project/editor flow | Cap | Partial | Desktop unit checkpoint | End-to-end native flow pending |
| Recording countdown | Yes | Yes | Required | Desktop overlay/countdown | Cap + behavior reference | Partial | UI checks | Native shortcut/state test pending |
| Start/stop recording | Yes | Yes | Required | Tauri command and Rust session | Cap | Partial | Native matrix blocked | Recording reliability not certified |
| Pause/resume recording | Yes | Partial | Required | Native session state machine | Cap | Partial | Native matrix blocked | Verify clocks and final media |
| Visible recording state | Yes | Yes | Required | Recording controls/tray/overlay | Cap | Partial | Scoped UI checks | Cross-window sync pending |
| Recording keyboard shortcuts | Yes | Yes | Required | Desktop hotkey layer | Cap | Partial | Unit/manual pending | Collision and accessibility review |
| Microphone selection | Yes | Yes | Required | Cap audio device graph | Cap | Partial | Native matrix blocked | Hot-plug and default-device changes |
| System-audio selection | Yes | Yes | Required | Platform-native audio capture | Cap | Partial | Native matrix blocked | OS support/permissions differ |
| Camera selection | Yes | Partial | Required | Separate Cap camera source | Cap | Partial | Native matrix blocked | Synchronization pending |
| Camera preview | Yes | Yes | Required | Desktop device preview | Cap | Partial | UI source checks | Real-device testing pending |
| Microphone level meter | Yes | Partial | Required | Desktop audio meter | Cap | Partial | Native/manual pending | Calibrate against device input |
| System-audio level meter | Partial | Partial | Required | Separate source meter | Cap-derived | Partial | Native/manual pending | Needs platform coverage |
| Clipping warning | Partial | Partial | Required | Meter threshold and warning state | FlowReco target | Planned | Unit/native needed | Avoid false positives |
| Stereo/mono selection | Partial | Partial | Required where relevant | Source/encoder channel policy | Cap media graph | Partial | Media tests blocked | UI/platform support varies |
| Device hot-plug handling | Partial | Partial | Required | Native device refresh/recovery | Cap | Partial | Native matrix blocked | Must preserve session where safe |
| Device-loss message | Partial | Partial | Required | Recording health diagnostics | Cap + FlowReco copy | Partial | Native fault injection | State must say what remained safe |
| Echo-awareness | Partial | No | Required | Device/track guidance, no destructive DSP default | FlowReco target | Planned | Native fixtures needed | Do not promise cancellation blindly |
| Webcam as separate source | Yes | Partial | Required where possible | Cap synchronized camera track | Cap | Partial | Native A/V matrix | Required for non-destructive layout |
| Mic/system audio as separate tracks | Partial | Partial | Required where supported | Rust recording bundle tracks | Cap | Partial | Native A/V matrix | Platform-dependent |
| Interaction event stream | Yes | Yes | Required | Rust cursor/event metadata | Cap + new FlowReco generator | Partial | Rust tests written; blocked | Timing/geometry only |
| Pointer movement samples | Yes | Yes | Required | Cursor capture metadata | Cap | Partial | Native matrix blocked | Sampling/drop behavior pending |
| Click down/up and position | Yes | Yes | Required | Input monitor metadata | Cap + Recordly behavior | Partial | Rust generator tests written | Needs permission/platform validation |
| Scroll activity/direction | Partial | Partial | Required | Privacy-safe event extension | FlowReco target | Planned | Deterministic fixtures needed | No content captured |
| Typing-activity timing | Partial | Partial | Required | Activity pulse without key content | FlowReco privacy model | Partial | Migration/unit tests written | Exact key disabled by default |
| UI focus/element bounds | No | No | Optional permission | Platform accessibility adapter | FlowReco target | Planned | Privacy/native tests | No accessibility text persisted |
| Window movement/bounds events | Partial | No | Required when observable | Target geometry normalization | Cap-derived | Partial | Native geometry fixtures | Needed for window recordings |
| Local incremental recording | Yes | Yes | Required | Cap recording bundle | Cap | Partial | Native crash tests blocked | Data-safety priority |
| Interrupted recording recovery | Yes | Partial | Required | Recovery scanner/finalizer and legacy naming | Cap + FlowReco changes | Partial | Filename unit tests; native pending | Preserve raw sources |
| Low-disk warning/recovery | Partial | Partial | Required | Preflight + runtime disk checks | Cap-derived | Planned | Fault-injection needed | No destructive cleanup |
| Progressive upload while recording | Yes | No | Required in Instant Mode | Chunked upload queue | Cap | Partial | Offline/reconnect E2E pending | Explicit cloud intent only |
| Resumable upload after network loss | Yes | No | Required | Durable chunk/session state | Cap | Partial | Network fault test pending | Local fallback required |
| Quick share link after stop | Yes | No | Required | Cap publish finalize flow | Cap | Partial | Hosted/self-host E2E | Never fake success on rejection |

## Automatic zoom and camera motion

| Feature | Cap support | Recordly support | Reco target (FlowReco) | Chosen implementation | Source/provenance | Status | Tests | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Automatic zoom suggestions | Yes | Yes | Signature/required | Deterministic Rust generator | Cap foundation + FlowReco implementation | Partial | Rust tests written; blocked | Native/event integration pending |
| Coordinate normalization | Yes | Partial | Required | Source-frame/DPI/crop normalization | Cap render graph + FlowReco | Partial | Rust fixtures written | Multidisplay native cases pending |
| Click clustering | Partial | Yes | Required | Deterministic time/distance clustering | FlowReco implementation | Partial | Unit tests written; blocked | Equal inputs must match |
| Double-click/click-cluster intent | Partial | Partial | Required | Cluster scoring rules | FlowReco implementation | Partial | Unit tests written; blocked | Must avoid duplicate micro-zooms |
| Pointer dwell intent | Partial | Yes | Required | Dwell segment scoring | FlowReco implementation | Partial | Unit tests written; blocked | Noise threshold needs tuning |
| Scroll-burst intent | No | Partial | Required | Event grouping extension | FlowReco target | Planned | Unit fixtures needed | Direction retained, content absent |
| Typing-activity intent | No | Partial | Required | Timing-only intent segments | FlowReco target | Planned | Privacy/unit fixtures | No typed text |
| Accessibility-element targeting | No | No | Optional | Prefer consented element bounds | FlowReco target | Planned | Native/privacy matrix | Fallback to point region |
| Edge-safe focal point | Yes | Partial | Required | Bounded normalized focus | Cap renderer + FlowReco | Partial | Rust unit tests written | Golden frames blocked |
| Target padding | Partial | Partial | Required | Global/project generator setting | FlowReco target | Partial | Config tests written | Full UI control pending |
| Lead-in before interaction | Yes | Partial | Required | Segment timing rule | Cap/FlowReco | Partial | Unit tests written | Timeline edit remains authoritative |
| Hold after interaction | Yes | Partial | Required | Segment timing rule | Cap/FlowReco | Partial | Unit tests written | Global and per-region control |
| Merge adjacent zooms | Partial | Yes | Required | Compatibility/threshold merge | FlowReco implementation | Partial | Unit tests written | Avoid repeated in/out motion |
| Reframe during active zoom | Yes | Yes | Required | Shared spring/focus interpolation | Cap renderer + behavior reference | Partial | Renderer tests present; blocked | Golden frames pending |
| Graceful return to full frame | Yes | Yes | Required | Shared transition curve | Cap renderer | Partial | Renderer tests present; blocked | Next intent may stay zoomed |
| Webcam collision avoidance | Partial | Yes | Required | Render-time safe-area constraint | FlowReco target | Planned | Golden frames needed | Captions also considered |
| Caption collision avoidance | Partial | No | Required | Safe-area constraint | FlowReco target | Planned | Golden frames needed | Never hide active caption target |
| Enable/disable all auto zooms | Yes | Partial | Required | Editor/project setting | Cap + FlowReco UI | Partial | Desktop focused tests | Export parity pending |
| Generate/regenerate suggestions | Yes | Partial | Required | Desktop command replacing auto regions safely | FlowReco implementation | Partial | UI/Rust tests | Preserve manual regions |
| Accept/reject suggestion | Partial | Partial | Required | Auto provenance on normal regions | FlowReco target | Planned | Project tests needed | Reject must persist |
| Add manual zoom | Yes | Yes | Required | Timeline zoom region | Cap | Implemented | Existing UI tests | Native export verification pending |
| Move zoom region | Yes | Yes | Required | Timeline drag | Cap | Implemented | Existing editor tests | Frame-precision manual test pending |
| Resize zoom edges | Yes | Yes | Required | Timeline handles | Cap | Implemented | Existing editor tests | Validate min duration |
| Zoom scale presets | Partial | Yes | Required | 1.25/1.5/1.8/2/2.5/3× controls | FlowReco UI | Partial | Focused desktop tests | Final tree rerun required |
| Custom numeric zoom | Yes | Yes | Required | Bounded numeric/slider control | Cap + FlowReco UI | Partial | Clamp/format unit tests | Accepted range currently bounded |
| Editable focal point | Yes | Yes | Required | Normalized content-space focus | Cap | Partial | Renderer tests present | Direct manipulation polish pending |
| Animated/keyframed focal point | Partial | Partial | Required | Project-region focus animation | Cap renderer extension | Partial | Renderer tests | Full keyframe UI pending |
| Transition-in timing | Partial | Partial | Required | Per-region timing/easing | FlowReco target | Partial | Project/render tests needed | Inspector depth pending |
| Hold timing | Partial | Partial | Required | Per-region value | FlowReco target | Partial | Unit tests needed | Global default plus override |
| Transition-out timing | Partial | Partial | Required | Per-region timing/easing | FlowReco target | Partial | Project/render tests needed | Inspector depth pending |
| Easing presets | Yes | Yes | Required | Shared renderer easing enum | Cap + behavior reference | Partial | Renderer tests present | UI selection audit pending |
| Custom cubic-bezier/spring | Partial | Partial | Required/pro | Versioned curve parameters | Cap spring + FlowReco target | Planned | Determinism/golden tests | Validate stable bounds |
| Cursor influences camera | Yes | Yes | Required | Per-region follow control | Cap renderer + behavior reference | Partial | Renderer tests present | Inspector control pending |
| Copy/paste zoom settings | Partial | Partial | Required | Editor clipboard for safe properties | FlowReco UI | Partial | Focused desktop tests | Multiselect persistence pending |
| Apply zoom to multiple regions | Partial | No | Required | Multi-edit transaction | FlowReco target | Partial | UI tests needed | Undo as one action |
| Reset to automatic values | No | Partial | Required | Preserve generated provenance/defaults | FlowReco target | Planned | Project tests needed | Must not regenerate unrelated regions |
| Global default zoom level | Yes | Partial | Required | General/project setting | Cap + FlowReco | Partial | Settings tests | Migration/reopen test pending |
| Global in/out speed | Partial | Partial | Required | Generator defaults | FlowReco target | Partial | Unit tests written | UI wiring pending |
| Global follow strength | Yes | Yes | Required | Renderer/generator parameter | Cap + behavior reference | Partial | Renderer tests | UI control audit pending |
| Global merge threshold | No | Partial | Required | Generator parameter | FlowReco implementation | Partial | Rust tests written | UI wiring pending |
| Global edge-safe margin | Partial | No | Required | Generator/render parameter | FlowReco UI/implementation | Partial | Clamp tests | Golden frames pending |
| Reduce-motion camera mode | Partial | No | Required | Gentler bounded defaults | FlowReco target | Planned | Accessibility/golden tests | Project timing changes need consent |

## Timeline, project, and editing

| Feature | Cap support | Recordly support | Reco target (FlowReco) | Chosen implementation | Source/provenance | Status | Tests | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Non-destructive project | Yes | Yes | Required | Cap project model | Cap | Partial | Rust tests blocked | Original media immutable invariant |
| Atomic project save | Partial | Yes | Required | Temp-write/replace | Cap + Recordly behavior | Partial | Native filesystem tests pending | Must survive interruption |
| Background autosave | Yes | Yes | Required | Debounced atomic save | Cap | Partial | Editor tests | Crash/reopen native test pending |
| Save and reopen project | Yes | Yes | Required | Versioned `.cap` compatibility initially | Cap | Partial | Project tests blocked | FlowReco format migration deferred |
| Project migrations | Yes | Partial | Required | Versioned Rust migrations | Cap | Partial | Fixture matrix pending | Preserve unknown fields where practical |
| Missing-media relink | Partial | Partial | Required | Recoverable source resolver | FlowReco target | Planned | Filesystem fixtures needed | Never discard edits |
| Undo/redo | Yes | Yes | Required | Editor transaction history | Cap | Implemented | Existing editor tests | Cross-feature coverage to expand |
| Canvas preview/playback | Yes | Yes | Required | Cap shared renderer preview | Cap | Partial | UI tests; parity blocked | Golden export comparison pending |
| Playback controls/timecode | Yes | Yes | Required | Desktop editor controls | Cap | Implemented | Existing UI tests | Accessibility manual audit pending |
| Frame stepping | Yes | Partial | Required | Project-time seek by output frame | Cap | Partial | Timing fixtures needed | VFR semantics must be defined |
| Multitrack timeline | Yes | Yes | Required | Cap Solid timeline | Cap | Partial | Editor tests | Full required tracks/ops incomplete |
| Drag regions | Yes | Yes | Required | Timeline drag transactions | Cap | Implemented | Existing editor tests | Precision manual test pending |
| Resize regions | Yes | Yes | Required | Edge handles | Cap | Implemented | Existing editor tests | Invalid overlap feedback audit |
| Single/multiselect | Partial | Partial | Required | Timeline selection model | Cap-derived | Partial | UI tests needed | Keyboard selection pending |
| Duplicate | Partial | Partial | Required | Project transaction | FlowReco target | Partial | UI/project tests | Type coverage varies |
| Split | Yes | Yes | Required | Clip split at playhead | Cap | Partial | Editor tests | Overlay/time-map coverage pending |
| Delete | Yes | Yes | Required | Project transaction | Cap | Implemented | Existing editor tests | Destructive confirmation depends on reversibility |
| Copy/paste regions | Partial | Partial | Required | Typed editor clipboard | FlowReco target | Partial | UI/project tests | External clipboard privacy review |
| Timeline snapping | Yes | Partial | Required | Cap snapping utilities | Cap | Implemented | Existing snapping tests | Captions/markers coverage audit |
| Keyboard nudging | Partial | Partial | Required | Frame/time increment transaction | Cap-derived | Partial | Shortcut tests needed | Show timecode result |
| Timeline scale/zoom | Yes | Yes | Required | Timeline viewport | Cap | Implemented | Existing UI tests | Large project performance pending |
| Horizontal timeline scroll | Yes | Yes | Required | Timeline viewport | Cap | Implemented | Existing UI tests | Trackpad/keyboard manual audit |
| Ripple delete | Partial | No | Required | Time-map transaction mode | FlowReco target | Planned | Compound fixtures needed | Default should be explicit |
| Non-ripple delete | Yes | Yes | Required | Existing remove range/clip behavior | Cap | Partial | Editor tests | All region types pending |
| Invalid-overlap feedback | Partial | Partial | Required | Typed constraints + inline explanation | FlowReco target | Partial | UI tests needed | Never silently clamp without feedback |
| Audio waveform | Yes | Partial | Required | Cached waveform track | Cap | Partial | Media/UI tests | Long-project performance pending |
| Track mute/solo | Partial | Partial | Required | Project audio track flags | Cap-derived | Partial | Audio tests needed | Separate source coverage |
| Track/clip gain | Yes | Partial | Required | Project gain and shared mixer | Cap | Partial | Rust audio tests blocked | Clipping policy pending |
| Fade-in/fade-out | Partial | Partial | Required | Project envelope | FlowReco target | Planned | Audio golden fixtures | UI and renderer needed |
| Trim start/end | Yes | Yes | Required | Clip source bounds | Cap | Implemented | Existing editor tests | Native export verification pending |
| Remove middle range | Yes | Yes | Required | Split + delete/time map | Cap | Partial | Compound fixtures needed | Ripple option pending |
| Speed-up regions | Partial | Yes | Required | Versioned time-map region | Cap/FlowReco target | Partial | Rust media tests blocked | Overlay/audio mapping pending |
| Slow-down regions | Partial | Yes | Required | Versioned time-map region | Cap/FlowReco target | Partial | Rust media tests blocked | Source frame availability matters |
| Custom speed | Partial | Yes | Required | Bounded numeric speed | FlowReco target | Partial | Project tests needed | Useful presets required |
| Speech pitch preservation | Partial | Partial | Required where supported | Audio time-stretch policy | Cap media graph | Planned | Quality/A/V fixtures | Fallback must be disclosed |
| Text annotations | Yes | Yes | Required | Cap text regions/renderer | Cap | Partial | Editor/render tests | Full styling/animation audit pending |
| Image annotations | Partial | Yes | Required | Versioned asset region | FlowReco target | Planned | Asset/render tests | Fit/crop/opacity/radius |
| Shape/figure annotations | Yes | Yes | Required | Canvas element regions | Cap + behavior reference | Partial | Editor/render tests | Arrow/line/highlight coverage audit |
| Blur/redaction regions | Yes | Partial | Required | Shared render mask/effect | Cap | Partial | Golden frames blocked | Verify no frame leaks at edges |
| Position/scale/rotate overlays | Yes | Yes | Required | Canvas transform model | Cap | Partial | Editor/render tests | Direct manipulation polish pending |
| Safe-area/alignment guides | Partial | Partial | Required | Editor-only guides over shared coordinates | FlowReco target | Planned | UI accessibility tests | Guides never enter export |
| Captions track | Yes | Yes | Required | Cap caption project regions | Cap | Partial | Web/editor tests | Export parity/native pending |
| Caption editing | Yes | Yes | Required | Desktop caption inspector/list | Cap | Partial | Existing tests | Keyboard and long transcript audit |
| Chapters/markers | Yes | Partial | Optional/required web | Project/share metadata | Cap | Partial | Web tests | Timeline marker editing incomplete |

## Cursor, webcam, frame, and audio styling

| Feature | Cap support | Recordly support | Reco target (FlowReco) | Chosen implementation | Source/provenance | Status | Tests | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rendered cursor show/hide | Yes | Yes | Required | Cap cursor render setting | Cap | Implemented | Renderer tests present | Native export verification pending |
| Cursor size | Yes | Yes | Required | Shared render scalar | Cap | Implemented | Renderer tests present | Bounds/accessibility audit |
| Original polished cursor theme | Yes | Yes | Required | Generated FlowReco SVG family | Original FlowReco | Implemented | 52/52 deterministic assets | Native hotspot rendering pending |
| Cursor smoothing | Yes | Yes | Required | Shared renderer interpolation | Cap + behavior reference | Partial | Renderer tests present | Golden frames blocked |
| Cursor motion blur | Yes | Yes | Required | Shared renderer effect | Cap + behavior reference | Partial | Renderer tests present | GPU/platform parity pending |
| Click bounce | Yes | Yes | Required | Event-driven cursor scale | Cap/Recordly behavior | Partial | Renderer tests | Inspector range audit |
| Cursor sway | Partial | Yes | Required | Deterministic motion model | Behavior reference/clean implementation | Partial | Unit tests needed | Avoid motion sickness |
| GIF loop cursor mode | No | Yes | Required | Loop-boundary cursor interpolation | FlowReco target | Planned | Loop fixture needed | GIF-specific control |
| Click highlight toggle | Yes | Partial | Required | Event overlay | Cap | Partial | Render tests | Export parity pending |
| Click highlight dot/ring | Partial | Partial | Required | Original vector effect styles | FlowReco target | Partial | Golden frames needed | At least dot and ring |
| Highlight color/size/opacity | Partial | Partial | Required | Project cursor style | FlowReco target | Partial | Project/render tests | Thickness/fade also required |
| Webcam enable/disable | Yes | Yes | Required | Separate track visibility | Cap | Implemented | Existing editor tests | Native sync pending |
| Webcam upload/replace/remove | Partial | Yes | Required | Project source management | Cap-derived | Partial | Filesystem/project tests | Missing media recovery needed |
| Webcam mirror | Yes | Yes | Required | Shared transform | Cap | Implemented | Renderer tests | Export parity pending |
| Webcam size and position presets | Yes | Yes | Required | Project layout settings | Cap | Implemented | Existing tests | Custom coordinates included |
| Webcam margins/roundness/shadow | Yes | Yes | Required | Shared compositor settings | Cap + behavior reference | Partial | Renderer tests | Full inspector audit |
| Webcam crop | Partial | Yes | Required | Source crop in render graph | FlowReco target | Partial | Golden frames needed | Non-destructive |
| Zoom-reactive webcam | Partial | Yes | Required | Collision/scale policy in renderer | FlowReco target | Planned | Golden frames needed | User-disableable |
| Built-in backgrounds | Yes | Yes | Required | Original generated FlowReco set | Original FlowReco | Implemented | Generator + source asset audit | Six original wallpapers; packaged-bundle inspection pending |
| Custom background upload | Yes | Yes | Required | Project asset reference | Cap | Implemented | Existing editor tests | Relink/missing file pending |
| Solid color background | Yes | Yes | Required | Shared renderer | Cap | Implemented | Renderer tests | — |
| Gradient background | Yes | Yes | Required | Shared renderer | Cap | Implemented | Renderer tests | Original presets only |
| Frame padding/corners | Yes | Yes | Required | Shared layout transform | Cap | Implemented | Renderer tests | Golden parity pending |
| Background blur/shadow | Yes | Yes | Required | Shared renderer effects with license-cleared model delivery | Cap + FlowReco safety gate | Partial | Renderer tests; unblurred fallback | ONNX weights intentionally unbundled pending provenance |
| Aspect-ratio presets | Yes | Yes | Required | Canvas/output presets | Cap | Implemented | Dimension tests | Social presets audit |
| Additional audio clips | Yes | Yes | Required | Audio timeline source regions | Cap | Partial | Audio tests blocked | Import/relink/codec matrix pending |
| Bundled music library | Yes | Partial | Optional | No inherited music; local user import first | FlowReco policy | Partial | Source asset audit | Inherited tracks removed; licensing-safe catalog deferred |

## Export and publishing

| Feature | Cap support | Recordly support | Reco target (FlowReco) | Chosen implementation | Source/provenance | Status | Tests | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Local MP4 export | Yes | Yes | Required | Cap Rust export/encoder/muxer | Cap | Partial | Rust/native blocked | End-to-end output not certified |
| Export through 4K UHD | Yes | Partial | Required | Presets/capability probing | Cap | Partial | Hardware matrix blocked | 4K availability varies |
| Export at 60 fps | Yes | Partial | Required | Cap encoder timing | Cap | Partial | Media matrix blocked | Includes 4K60 qualification |
| Practical lower presets | Yes | Yes | Required | Resolution/FPS preset UI | Cap | Implemented | Dimension/UI tests | Final encoder matrix pending |
| No forced watermark | Partial | Yes | Required | Remove hidden/default watermark path | FlowReco decision | Partial | Artifact/render audit | Optional user branding allowed |
| GIF export | Yes | Yes | Required | Existing Rust GIF encoder + new UX | Cap + Recordly behavior | Partial | Rust/native blocked | Quality/loop/dimension tests pending |
| GIF FPS selection | Partial | Yes | Required | GIF export setting | FlowReco target | Planned | Encoder fixtures | Sensible bounds needed |
| GIF loop toggle | Partial | Yes | Required | Encoder metadata and cursor loop | FlowReco target | Planned | Loop fixture | — |
| GIF size presets | Partial | Yes | Required | Output preset UI | FlowReco target | Planned | Dimension/file-size tests | Warn on extreme output |
| Export quality selection | Yes | Yes | Required | Codec-aware preset/advanced controls | Cap | Implemented | UI tests | Visual quality matrix pending |
| Output dimensions/aspect ratio | Yes | Yes | Required | Shared canvas/export config | Cap | Implemented | Dimension tests | Odd codec dimensions handled |
| Export progress | Yes | Yes | Required | Tauri events and export state | Cap | Partial | UI tests | Accuracy/native failure cases pending |
| Export cancellation | Yes | Partial | Required when safe | Cooperative cancellation/checkpoint | Cap | Partial | Native fault tests | Preserve partial/temp safety |
| Export pause | No | No | Optional where safe | Only after encoder checkpoint design | FlowReco target | Planned | Stress tests | Do not fake pause |
| Export error recovery/retry | Partial | Partial | Required | Retain project/temp state and restart | FlowReco target | Partial | Fault injection needed | Explain what is safe |
| Reveal in file manager | Yes | Yes | Required | Tauri shell reveal | Cap | Implemented | Platform manual test | Packaged OS verification pending |
| Publish to configured server | Yes | No | Required | Cap upload/share flow with FlowReco endpoint | Cap | Partial | E2E pending | No silent Cap endpoint |
| Upload access setting before publish | Yes | No | Required | Desktop/web share policy | Cap | Partial | Access matrix pending | Server authoritative |
| Export/share rejection handling | Partial | No | Required | Honest error and retry state | FlowReco changes | Implemented | Targeted UI tests | Never emit success after rejection |

## Web, sharing, collaboration, and hosting

| Feature | Cap support | Recordly support | Reco target (FlowReco) | Chosen implementation | Source/provenance | Status | Tests | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Recording library | Yes | Local browser | Required | Cap dashboard | Cap | Implemented | Web suite passed | Final brand visual audit pending |
| Folders/organization | Yes | Partial | Required | Cap dashboard/database | Cap | Implemented | Web suite passed | E2E deployment pending |
| Recording metadata/thumbnails | Yes | Partial | Required | Cap media/web pipeline | Cap | Partial | Web tests | Media server E2E pending |
| Public share | Yes | No | Required | Server access policy | Cap | Partial | Web tests | Access matrix E2E pending |
| Unlisted share | Yes | No | Required | Server access policy | Cap | Partial | Web tests | URL discovery semantics audit |
| Private share | Yes | No | Required | Authenticated policy | Cap | Partial | Web tests | Access matrix E2E pending |
| Workspace-only share | Yes | No | Required | Organization policy | Cap | Partial | Web tests | Role matrix pending |
| Password-protected share | Yes | No | Required | Server password gate | Cap | Partial | Web tests | Rate-limit/security E2E pending |
| Link expiry | Partial | No | Required | Server access metadata | Cap-derived | Partial | Web tests needed | Timezone/cache behavior |
| Disable downloads | Yes | No | Required | Server policy and player UI | Cap | Partial | Web tests | Direct-object authorization audit |
| Embeddable player | Yes | No | Required | Cap embed SDK/player | Cap | Partial | Web tests | Public API branding/version review |
| Timestamped comments | Yes | No | Required | Cap web collaboration | Cap | Implemented | Web suite passed | Realtime/deployment E2E pending |
| Comment replies | Yes | No | Required | Cap database/UI | Cap | Implemented | Web suite passed | Notification E2E pending |
| Emoji reactions | Yes | No | Required | Cap share UI/backend | Cap | Implemented | Web suite passed | Accessibility audit pending |
| Transcript display | Yes | Partial captions | Required | Cap transcript/share UI | Cap | Partial | Web suite passed | Provider/media E2E pending |
| Clickable chapters | Yes | No | Required | Cap AI/manual chapter metadata | Cap | Partial | Web tests | Provider opt-in audit |
| Viewer analytics | Yes | No | Required/privacy-aware | Cap/Tinybird adapter | Cap | Partial | Web tests | Consent/retention/deployment pending |
| Team workspaces | Yes | No | Required | Cap organizations | Cap | Implemented | Web suite passed | Deployment role E2E pending |
| Invitations | Yes | No | Required | Cap auth/email workflow | Cap | Partial | Web tests | Email provider E2E pending |
| Workspace roles | Yes | No | Required | Cap role policy | Cap | Partial | Web tests | Full authorization matrix pending |
| Custom domain | Yes | No | Required | Cap organization/domain routes | Cap | Partial | Web tests | DNS/TLS deployment test pending |
| Recording downloads | Yes | Yes local | Required | Authorized object download | Cap | Partial | Web tests | Provider/range request E2E |
| Share link thumbnails/metadata | Yes | No | Required | Next metadata/media pipeline | Cap | Partial | Web tests | Crawler/object storage E2E |
| Optional AI transcript/captions | Yes | Local Whisper | Required/opt-in | Provider adapter with explicit consent | Cap + Recordly behavior | Partial | Unit tests | No silent egress; local option desirable |
| AI title suggestions | Yes | No | Optional | Provider-configured backend | Cap | Partial | Web tests | Explicit request only |
| AI summaries | Yes | No | Optional | Provider-configured backend | Cap | Partial | Web tests | Explicit request only |
| AI chapter suggestions | Yes | No | Optional | Provider-configured backend | Cap | Partial | Web tests | Manual edit required |
| Loom import | Yes | No | Required where feasible | Cap importer preserving source metadata | Cap | Partial | Web/import tests | Failure/duplicate fixtures pending |
| Hosted deployment | Yes | No | Required/configurable | FlowReco web/API/object storage topology | Cap | Partial | Web tests | Production infrastructure not supplied here |
| Docker Compose self-host | Yes | No | Required | Cap Compose foundation | Cap | Blocked | Docker unavailable | Fresh install/upgrade/backup pending |
| AWS S3 | Yes | No | Required | S3 abstraction | Cap | Partial | Integration test pending | Credentials/region matrix |
| Cloudflare R2 | Yes | No | Required | S3-compatible endpoint | Cap | Partial | Integration test pending | Multipart/range behavior |
| Backblaze B2 | Compatible | No | Required | S3-compatible endpoint | Cap-derived | Planned | Integration test needed | Document provider setup |
| MinIO | Yes | No | Required | Local Docker object store | Cap | Blocked | Docker unavailable | Self-host reference provider |
| Wasabi | Compatible | No | Required | S3-compatible endpoint | Cap-derived | Planned | Integration test needed | Endpoint/path-style audit |
| Generic S3-compatible storage | Yes | No | Required | Configurable endpoint/region/path style | Cap | Partial | Provider contract tests | Clear compatibility limits |
| Data deletion/retention | Yes | No | Required | Web policy and object deletion | Cap | Partial | Web tests | Provider/lifecycle E2E pending |

## Settings, onboarding, APIs, and platform quality

| Feature | Cap support | Recordly support | Reco target (FlowReco) | Chosen implementation | Source/provenance | Status | Tests | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Permission onboarding | Yes | Yes | Required | FlowReco desktop onboarding | Cap + original UI | Partial | UI checks | Native TCC/Windows test pending |
| Screen-capture permission guidance | Yes | Yes | Required | Platform-specific onboarding | Cap | Partial | Native manual | Terminal/dev vs packaged guidance |
| Accessibility/input permission guidance | Partial | Partial | Required when enhanced | Explicit privacy explanation | FlowReco target | Partial | Native/privacy audit | Enhanced detection optional |
| Microphone/camera permission guidance | Yes | Yes | Required | Platform onboarding | Cap | Partial | Native manual | Deny/retry paths pending |
| Device defaults | Yes | Yes | Required | General settings store | Cap | Partial | Settings tests | Hot-plug migration pending |
| Output defaults | Yes | Yes | Required | Project/export settings | Cap | Partial | Settings tests | Project vs global precedence |
| Custom hotkeys | Partial | Yes | Required | Desktop shortcut settings | Cap + behavior reference | Partial | Shortcut tests | OS conflicts/restore defaults |
| Zoom defaults | Partial | Yes | Required | General/project settings | FlowReco extension | Partial | Unit tests written | Full UI wiring pending |
| Cursor defaults | Yes | Yes | Required | General/project settings | Cap | Partial | Settings tests | Migration audit |
| Webcam defaults | Yes | Yes | Required | General/project settings | Cap | Partial | Settings tests | Device/layout distinction |
| Storage location settings | Yes | Yes | Required | Desktop filesystem settings | Cap | Partial | Filesystem/native tests | Permissions/free-space guidance |
| Privacy settings | Yes | Partial | Required | Explicit capture/upload/telemetry/AI controls | FlowReco policy | Partial | Migration tests written | Unified egress summary desirable |
| Telemetry opt-in | Upstream opt-out | Partial | Required | Default off + migration marker | FlowReco implementation | Partial | Rust tests written; blocked | Live traffic audit pending |
| Update settings/check | Yes | Yes | Required | Trusted configurable feed | Cap + FlowReco policy | Partial | Config/unit checks | Signing/update drill pending |
| Diagnostics export | Yes | Partial | Required | Privacy-scrubbed local bundle | Cap-derived | Partial | Redaction tests needed | Never include private event content |
| Configurable server URL | Yes | No | Required | Desktop endpoint setting | Cap | Partial | Routing tests | Remove silent Cap fallback |
| Localhost/self-host without commercial gate | Partial | No | Required | Local capabilities unentitled | FlowReco changes | Implemented | Targeted UI tests | Server may enforce server policy |
| macOS 14+ | Yes | Yes | Release blocking | Tauri/Rust native stack | Cap | Blocked | No macOS host | Apple Silicon and Intel required |
| Windows 10 19041+ | Yes | Yes | Release blocking | Tauri/Rust native stack | Cap | Blocked | No Windows host | Intel/AMD required |
| Windows 11 | Yes | Yes | Release blocking | Tauri/Rust native stack | Cap | Blocked | No Windows host | Hardware encoder matrix |
| Linux buildability | Partial | Yes | Best effort | Preserve abstractions, no release promise | Cap | Partial | Linux source checks | Not release-blocking |
| ARM64 Windows | Dependency-dependent | Partial | Consider | Maintain portable boundaries | FlowReco target | Planned | Dependency audit needed | No release promise yet |
| Accessibility/reduced motion | Partial | Partial | Required | Shared UI tokens and motion policy | FlowReco direction | Partial | Automated/manual audit pending | WCAG 2.2 AA target |
| Localization | Partial | Yes | Maintain where practical | Existing i18n boundaries | Cap + Recordly reference | Partial | String extraction tests | FlowReco copy incomplete across corpus |
| Embed SDK | Yes | No | Required | Cap SDK with versioned FlowReco API | Cap | Partial | Package tests | Rename/compat review pending |
| Recorder SDK | Yes | No | Feasible/desired | Cap recorder SDK | Cap | Partial | Package tests | Privacy/API support matrix pending |
| CLI | Yes | No | Required useful workflows | Cap Rust CLI | Cap | Partial | Rust blocked | Rebrand and server/API audit pending |
| Stable API/contracts | Yes | No | Required | Effect contracts/domain packages | Cap | Partial | Web suite passed | Versioning/deprecation policy needed |
| Database migrations | Yes | No | Required | Drizzle migration process | Cap | Partial | Web tests | Docker upgrade/rollback pending |
| Observability | Yes | Partial diagnostics | Required/opt-in remote | Structured local diagnostics + explicit exporters | Cap + FlowReco policy | Partial | Unit/config tests | Privacy and retention audit |
| Extension API | No | Yes | Later | New capability-based sandboxed API | Recordly idea, clean design | Planned | Threat model/tests needed | Do not load Electron extensions |
| Extension marketplace | No | Yes | Later | Signed registry after runtime security | Recordly idea, clean design | Planned | Supply-chain tests needed | Disabled until safe |
| Custom fonts | Partial | Yes | Desired | Project font assets with licensing warnings | FlowReco target | Planned | Render/packaging tests | Embed/export portability |
| Original FlowReco branding | No | No | Required | Original marks/icons/cursors/backgrounds | Original FlowReco | Partial | Asset reproducibility tests | Final bundle scan pending |

## Status interpretation

- **Implemented** rows still require the platform or deployment tests called out in their notes before a release claim.
- **Partial** is the dominant status because the inherited foundation and current additions have not completed the macOS, Windows, media-golden, and self-host acceptance matrices.
- **Blocked** rows include an exact environmental unblock path in [TEST_REPORT.md](TEST_REPORT.md).
- **Planned** rows are commitments in the target product, not promises that code exists today.
