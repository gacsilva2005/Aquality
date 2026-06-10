package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.dto.WeatherResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

@Service
public class WeatherService {

    @Value("${openweather.secret.path:/run/secrets/openweather_key}")
    private String secretPath;

    @Value("${openweather.api.url}")
    private String apiUrl;

    private String getApiKey() {
        try {
            return Files.readString(Path.of(secretPath)).trim();
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível ler o Docker Secret: " + secretPath, e);
        }
    }

    private final RestTemplate restTemplate = new RestTemplate();

    public WeatherResponseDTO getClima(double lat, double lon) {
        String url = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .queryParam("lat", lat)
                .queryParam("lon", lon)
                .queryParam("appid", getApiKey())
                .queryParam("units", "metric")
                .queryParam("lang", "pt_br")
                .toUriString();

        Map<?, ?> response = restTemplate.getForObject(url, Map.class);

        // Extrai temperatura e umidade do JSON do OpenWeatherMap
        Map<?, ?> main = (Map<?, ?>) response.get("main");
        double temperatura = ((Number) main.get("temp")).doubleValue();
        double umidade     = ((Number) main.get("humidity")).doubleValue();

        Map<?, ?> weatherInfo = (Map<?, ?>) ((java.util.List<?>) response.get("weather")).get(0);
        String descricao = (String) weatherInfo.get("description");

        // Impacto do calor na hidratação
        double aumentoSudorese = calcularAumentoSudorese(temperatura, umidade);
        double aguaRecomendada = calcularAguaExtra(temperatura, umidade);

        WeatherResponseDTO dto = new WeatherResponseDTO();
        dto.setTemperatura(temperatura);
        dto.setUmidade(umidade);
        dto.setDescricao(descricao);
        dto.setAumentoSudoresePercent(aumentoSudorese);
        dto.setAguaRecomendadaLitros(aguaRecomendada);

        return dto;
    }

    //Estimativa sudorese taxa
    private double calcularAumentoSudorese(double temp, double umidade) {
        // Índice de calor
        double heatIndex = temp + (0.33 * (umidade / 100.0) * 6.105) - 4.0;

        if (heatIndex >= 38) return 25.0;
        if (heatIndex >= 32) return 15.0;
        if (heatIndex >= 27) return 10.0;
        if (heatIndex >= 21) return 5.0;
        return 0.0;
    }

    //Recomendação de água
    private double calcularAguaExtra(double temp, double umidade) {
        double base = 0.5; // mínimo recomendado em qualquer clima
        if (temp >= 35) return base + 1.0;
        if (temp >= 30) return base + 0.75;
        if (temp >= 25) return base + 0.5;
        return base;
    }
}
