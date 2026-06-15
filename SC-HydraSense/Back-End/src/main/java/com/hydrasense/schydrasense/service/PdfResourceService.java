package com.hydrasense.schydrasense.service;

import org.springframework.stereotype.Service;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.Base64;
import java.util.logging.Logger;
import org.springframework.util.StreamUtils;

@Service
public class PdfResourceService {

    private static final Logger logger = Logger.getLogger(PdfResourceService.class.getName());
    
    // Timeout agressivo de 2.5s para não prender a thread
    private static final int TIMEOUT_MS = 2500;

    /**
     * Tenta baixar a imagem da URL e converte para Base64 Data URI.
     * Se falhar (timeout ou 404), retorna null ou um avatar genérico transparente.
     */
    public String convertUrlToBase64(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return null;
        }

        try {
            URL url = new URL(imageUrl);
            URLConnection connection = url.openConnection();
            connection.setConnectTimeout(TIMEOUT_MS);
            connection.setReadTimeout(TIMEOUT_MS);
            
            // Simular User-Agent comum para evitar bloqueios do Google
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");

            try (InputStream in = connection.getInputStream()) {
                byte[] imageBytes = StreamUtils.copyToByteArray(in);
                String base64 = Base64.getEncoder().encodeToString(imageBytes);
                // Assume JPEG por padrão para URLs externas (Google OAuth geralmente é JPEG)
                return "data:image/jpeg;base64," + base64;
            }
        } catch (Exception e) {
            logger.warning("Falha ao converter imagem para Base64 (Timeout ou erro): " + imageUrl + " - " + e.getMessage());
            // Fallback: pode ser o Base64 de uma imagem placeholder padrão, ou simplesmente null
            return getAvatarFallbackBase64();
        }
    }

    private String getAvatarFallbackBase64() {
        // Base64 miniatura de um SVG transparente ou avatar cinza genérico de 1x1
        return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    }
}
