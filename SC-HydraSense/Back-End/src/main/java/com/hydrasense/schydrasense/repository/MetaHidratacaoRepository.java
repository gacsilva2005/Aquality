package com.hydrasense.schydrasense.repository;

import com.hydrasense.schydrasense.model.MetaHidratacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MetaHidratacaoRepository extends JpaRepository<MetaHidratacao, Long> {
    Optional<MetaHidratacao> findByAtletaId(Long atletaId);
}
