package main

import (
	"bytes"
	"embed"
	"encoding/json"
	"io"
	"net/http"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "catalog-desktop",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

type ProxyRequest struct {
	URL     string            `json:"url"`
	Method  string            `json:"method"`
	Headers map[string]string `json:"headers"`
	Body    interface{}       `json:"body"`
}

type ProxyResponse struct {
	Data       string `json:"data"`
	StatusCode int    `json:"statusCode"`
	Error      string `json:"error,omitempty"`
}

func (a *App) ProxyHTTPRequest(req ProxyRequest) ProxyResponse {
	var bodyReader io.Reader

	// Подготавливаем тело запроса
	if req.Body != nil {
		jsonBody, err := json.Marshal(req.Body)
		if err != nil {
			return ProxyResponse{Error: "Failed to marshal request body: " + err.Error()}
		}
		bodyReader = bytes.NewReader(jsonBody)
	}

	// Создаем HTTP запрос
	httpReq, err := http.NewRequest(req.Method, req.URL, bodyReader)
	if err != nil {
		return ProxyResponse{Error: "Failed to create request: " + err.Error()}
	}

	// Добавляем заголовки
	for key, value := range req.Headers {
		httpReq.Header.Set(key, value)
	}

	// Выполняем запрос
	client := &http.Client{}
	resp, err := client.Do(httpReq)
	if err != nil {
		return ProxyResponse{Error: "Request failed: " + err.Error()}
	}
	defer resp.Body.Close()

	// Читаем ответ
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return ProxyResponse{Error: "Failed to read response: " + err.Error()}
	}

	return ProxyResponse{
		Data:       string(body),
		StatusCode: resp.StatusCode,
	}
}
