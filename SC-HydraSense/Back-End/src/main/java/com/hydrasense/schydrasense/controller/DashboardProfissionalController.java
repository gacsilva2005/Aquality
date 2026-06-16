package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.dto.DashboardProfissionalDTO;
import com.hydrasense.schydrasense.service.DashboardProfissionalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard/profissional")
public class DashboardProfissionalController {

    private final DashboardProfissionalService dashboardService;

    public DashboardProfissionalController(DashboardProfissionalService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/{clubeId}")
    public ResponseEntity<DashboardProfissionalDTO> getDashboard(
            @PathVariable Long clubeId,
            @RequestParam(required = false) Long equipeId,
            @RequestParam(required = false, defaultValue = "7") Integer dias,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {
        DashboardProfissionalDTO dto = dashboardService.gerarDashboard(clubeId, equipeId, dias, lat, lon);
        return ResponseEntity.ok(dto);
    }
}
