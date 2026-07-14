use serde::Serialize;

use crate::{OutputFormat, write_json};

const RELEASES_URL: &str = "https://github.com/Atharvsinh-codez/FlowReco/releases";

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct UpdateReport {
    automatic_updates: bool,
    releases_url: &'static str,
    message: &'static str,
}

pub fn run(format: OutputFormat) -> Result<(), String> {
    let report = UpdateReport {
        automatic_updates: false,
        releases_url: RELEASES_URL,
        message: "Automatic updates are disabled until FlowReco has a signed release feed.",
    };

    match format {
        OutputFormat::Json => write_json(&report),
        OutputFormat::Text => {
            println!("{}", report.message);
            println!("Review verified builds at {}", report.releases_url);
            Ok(())
        }
    }
}
