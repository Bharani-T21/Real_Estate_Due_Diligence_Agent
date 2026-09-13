package com.infosys.realestate.repository;

import com.infosys.realestate.entity.DueDiligenceReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DueDiligenceReportRepository extends JpaRepository<DueDiligenceReport, Long> {

    List<DueDiligenceReport> findByPropertyPropertyId(Long propertyId);

    @EntityGraph(attributePaths = {"property", "requestedBy"})
    Page<DueDiligenceReport> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = {"property", "requestedBy"})
    Page<DueDiligenceReport> findByRequestedByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"property", "requestedBy"})
    Page<DueDiligenceReport> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    long countByStatus(String status);

    /** Monthly report counts for the last 6 months */
    @Query("SELECT FUNCTION('TO_CHAR', r.createdAt, 'YYYY-MM'), COUNT(r) " +
           "FROM DueDiligenceReport r WHERE r.createdAt >= :since " +
           "GROUP BY FUNCTION('TO_CHAR', r.createdAt, 'YYYY-MM') " +
           "ORDER BY FUNCTION('TO_CHAR', r.createdAt, 'YYYY-MM')")
    List<Object[]> countReportsByMonth(@org.springframework.data.repository.query.Param("since") java.time.LocalDateTime since);

    /** Average processing time across all COMPLETED reports */
    @Query("SELECT AVG(r.durationMs) FROM DueDiligenceReport r WHERE r.status = 'COMPLETED' AND r.durationMs IS NOT NULL")
    Double averageProcessingTimeMs();

    /** Top 5 properties by number of reports */
    @Query("SELECT r.property.propertyId, r.property.address, COUNT(r) as cnt " +
           "FROM DueDiligenceReport r GROUP BY r.property.propertyId, r.property.address ORDER BY cnt DESC")
    List<Object[]> topPropertiesByReportCount(Pageable pageable);
}

