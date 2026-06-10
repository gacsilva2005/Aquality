package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.dto.WeatherResponseDTO;
import com.hydrasense.schydrasense.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clima")
@CrossOrigin(origins = "*")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/atual")
    public ResponseEntity<WeatherResponseDTO> getClimaAtual(
            @RequestParam double lat,
            @RequestParam double lon) {
        WeatherResponseDTO dto = weatherService.getClima(lat, lon);
        return ResponseEntity.ok(dto);
    }
}
