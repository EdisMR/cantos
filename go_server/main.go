package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	// Directorio de archivos que se van a servir
	uploadsDir := "E:\\Github - Local\\cantos"
	serverPort := "0.0.0.0:3050"
	// Si se quiere cambiar el puerto, se puede modificar la variable serverPort

	//Clear console
	fmt.Print("\033[H\033[2J")

	// Comprobar si el directorio es válido
	if _, err := os.Stat(uploadsDir); os.IsNotExist(err) {
		fmt.Println("El directorio de archivos no existe")
		fmt.Printf("Se esperaba: %s\n", uploadsDir)
		return
	}

	// FileServer sirve los archivos del directorio especificado
	fs := http.FileServer(http.Dir(uploadsDir))

	// El multiplexor (mux) se encarga de manejar las solicitudes HTTP
	mux := http.NewServeMux()
	// El handle "/" se encarga de manejar las solicitudes de la ruta raíz
	mux.Handle("/", fs)

	// Se crea el servidor web
	server := &http.Server{
		// Se establece la dirección y el puerto en el que se va a escuchar
		Addr: serverPort,
		// El handler se encarga de manejar las solicitudes
		Handler: mux,
	}

	// Se imprime un mensaje de bienvenida
	fmt.Println("Bienvenido al Servidor del Proyecto Cantos")
	// Se imprime la dirección del directorio de archivos
	fmt.Printf("Directorio de archivos utilizado: %s\n", uploadsDir)
	// Se imprime la dirección del servidor
	fmt.Printf("Servidor escuchando en http://%s\n", serverPort)

	// Se inicia el servidor
	if err := server.ListenAndServe(); err != nil {
		// Si ocurre un error, se imprime en pantalla
		fmt.Printf("Error al iniciar el servidor: %v\n", err)
	}
}
