package com.hydrasense.schydrasense.repository;

import com.hydrasense.schydrasense.model.Kit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KitRepository extends JpaRepository<Kit, Long> {

    List<Kit> findByAtletaId(Long atletaId);

    List<Kit> findByAtletaIdAndModalidadeIgnoreCase(Long atletaId, String modalidade);
}