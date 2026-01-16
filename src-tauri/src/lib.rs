use tauri::{Manager, Window};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

#[tauri::command]
fn show_window(window: Window) {
    window.show().unwrap();
    window.set_focus().unwrap();
    window.center().unwrap();
}

#[tauri::command]
fn hide_window(window: Window) {
    window.hide().unwrap();
}

#[tauri::command]
async fn refine_prompt(
    prompt: String,
    provider: String,
    api_key: String,
    endpoint: Option<String>,
    model: Option<String>,
) -> Result<String, String> {
    let system_prompt = r#"You are a prompt engineering expert. Your task is to take a rough prompt and refine it into a clear, specific, and effective prompt.

Guidelines:
- Make the prompt more specific and detailed
- Add context where helpful
- Structure the prompt clearly
- Include any relevant constraints or requirements
- Keep the core intent of the original prompt

Return ONLY the refined prompt, nothing else."#;

    match provider.as_str() {
        "openai" => {
            call_openai(&api_key, &prompt, system_prompt, model.as_deref())
                .await
        }
        "anthropic" => {
            call_anthropic(&api_key, &prompt, system_prompt, model.as_deref())
                .await
        }
        "ollama" => {
            let url = endpoint.unwrap_or_else(|| "http://localhost:11434".to_string());
            call_ollama(&url, &prompt, system_prompt, model.as_deref())
                .await
        }
        _ => Err("Unknown provider".to_string()),
    }
}

async fn call_openai(
    api_key: &str,
    prompt: &str,
    system_prompt: &str,
    model: Option<&str>,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    let model = model.unwrap_or("gpt-4o-mini");

    let body = serde_json::json!({
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": format!("Refine this prompt:\n\n{}", prompt)}
        ],
        "max_tokens": 1024
    });

    let response = client
        .post("https://api.openai.com/v1/chat/completions")
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let json: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;

    json["choices"][0]["message"]["content"]
        .as_str()
        .map(|s| s.to_string())
        .ok_or_else(|| "Failed to parse response".to_string())
}

async fn call_anthropic(
    api_key: &str,
    prompt: &str,
    system_prompt: &str,
    model: Option<&str>,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    let model = model.unwrap_or("claude-3-5-haiku-latest");

    let body = serde_json::json!({
        "model": model,
        "max_tokens": 1024,
        "system": system_prompt,
        "messages": [
            {"role": "user", "content": format!("Refine this prompt:\n\n{}", prompt)}
        ]
    });

    let response = client
        .post("https://api.anthropic.com/v1/messages")
        .header("x-api-key", api_key)
        .header("anthropic-version", "2023-06-01")
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let json: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;

    json["content"][0]["text"]
        .as_str()
        .map(|s| s.to_string())
        .ok_or_else(|| "Failed to parse response".to_string())
}

async fn call_ollama(
    endpoint: &str,
    prompt: &str,
    system_prompt: &str,
    model: Option<&str>,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    let model = model.unwrap_or("llama3.2");

    let body = serde_json::json!({
        "model": model,
        "prompt": format!("{}\n\nRefine this prompt:\n\n{}", system_prompt, prompt),
        "stream": false
    });

    let response = client
        .post(format!("{}/api/generate", endpoint))
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let json: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;

    json["response"]
        .as_str()
        .map(|s| s.to_string())
        .ok_or_else(|| "Failed to parse response".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![
            show_window,
            hide_window,
            refine_prompt
        ])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            let window_clone = window.clone();

            // Register default hotkey: Cmd+Shift+Space
            let shortcut = Shortcut::new(
                Some(Modifiers::SUPER | Modifiers::SHIFT),
                Code::Space,
            );

            app.global_shortcut().on_shortcut(shortcut, move |_app, _shortcut, event| {
                if event.state == ShortcutState::Pressed {
                    if window_clone.is_visible().unwrap_or(false) {
                        let _ = window_clone.hide();
                    } else {
                        let _ = window_clone.show();
                        let _ = window_clone.set_focus();
                        let _ = window_clone.center();
                    }
                }
            })?;

            // Listen for blur event to hide window
            let window_for_blur = window.clone();
            window.on_window_event(move |event| {
                if let tauri::WindowEvent::Focused(focused) = event {
                    if !focused {
                        let _ = window_for_blur.hide();
                    }
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
