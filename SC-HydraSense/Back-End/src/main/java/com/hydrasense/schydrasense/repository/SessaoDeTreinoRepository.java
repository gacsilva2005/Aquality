package com.hydrasense.schydrasense.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hydrasense.schydrasense.model.SessaoDeTreino;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface SessaoDeTreinoRepository extends JpaRepository<SessaoDeTreino, Long> {
    List<SessaoDeTreino> findByAtletaId(Long atletaId);

    List<SessaoDeTreino> findByAtletaIdInAndDataHoraFimBetween(List<Long> atletaIds, java.time.LocalDateTime start, java.time.LocalDateTime end);

    Optional<SessaoDeTreino> findFirstByAtletaIdAndDataHoraFimIsNotNullAndTaxaSudoreseIsNotNullOrderByDataHoraFimDesc(Long atletaId);
    @Query(value = "SELECT COALESCE(AVG(taxa_sudorese), 0.0) as mediaTaxaSudorese, " +
                   "COALESCE(STDDEV(taxa_sudorese), 0.0) as desvioPadraoTaxaSudorese, " +
                   "COALESCE(AVG(balanco_hidrico), 0.0) as mediaBalancoHidrico " +
                   "FROM sessao_de_treino WHERE atleta_id = :atletaId", nativeQuery = true)
    EstatisticasProjection getEstatisticasAtleta(@Param("atletaId") Long atletaId);
}