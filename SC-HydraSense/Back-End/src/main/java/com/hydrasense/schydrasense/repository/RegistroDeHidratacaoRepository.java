package com.hydrasense.schydrasense.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.hydrasense.schydrasense.model.RegistroDeHidratacao;
import java.time.LocalDateTime;
import java.util.List;

public interface RegistroDeHidratacaoRepository extends JpaRepository<RegistroDeHidratacao, Long> {
    List<RegistroDeHidratacao> findByAtletaId(Long atletaId);

    @Query("SELECT SUM(r.volume) FROM RegistroDeHidratacao r WHERE r.atleta.id = :atletaId AND r.dataHora >= :start AND r.dataHora < :end")
    Double sumVolumeByAtletaIdAndDateRange(
        @Param("atletaId") Long atletaId, 
        @Param("start") LocalDateTime start, 
        @Param("end") LocalDateTime end
    );
}
