package com.infosys.realestate.config;

import com.infosys.realestate.entity.*;
import com.infosys.realestate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private ZoningRepository zoningRepository;

    @Autowired
    private PropertyTaxHistoryRepository propertyTaxHistoryRepository;

    @Autowired
    private FloodZoneRepository floodZoneRepository;

    @Autowired
    private PermitRepository permitRepository;

    @Autowired
    private DueDiligenceReportRepository dueDiligenceReportRepository;

    @Autowired
    private RiskAssessmentRepository riskAssessmentRepository;

    @Autowired
    private ReportHistoryRepository reportHistoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        List<String> rolesToSeed = List.of("ADMIN", "USER", "BUYER", "AGENT", "LEGAL_REVIEWER", "BANK");
        for (String roleName : rolesToSeed) {
            roleRepository.findByRoleName(roleName).orElseGet(() -> {
                Role r = new Role();
                r.setRoleName(roleName);
                return roleRepository.save(r);
            });
        }

        Role adminRole = roleRepository.findByRoleName("ADMIN").get();

        User adminUser = userRepository.findByEmail("admin@example.com").orElseGet(() -> {
            User u = new User();
            u.setName("System Admin");
            u.setEmail("admin@example.com");
            u.setPassword(passwordEncoder.encode("admin123"));
            u.setRole(adminRole);
            return userRepository.save(u);
        });

        // Ensure the exact 4 baseline properties exist
        if (!propertyRepository.existsById(1L)) {
            Property p1 = new Property();
            p1.setPropertyName("Luxury Villa");
            p1.setAddress("12, Beach Road, ECR");
            p1.setCity("Chennai");
            p1.setState("Tamil Nadu");
            p1.setZipCode("600041");
            p1.setPropertyType("Villa");
            p1.setCreatedBy(adminUser);
            propertyRepository.save(p1);
        }
        if (!propertyRepository.existsById(2L)) {
            Property p2 = new Property();
            p2.setPropertyName("Modern Apartment");
            p2.setAddress("405, Silicon Heights, Outer Ring Road");
            p2.setCity("Bangalore");
            p2.setState("Karnataka");
            p2.setZipCode("560103");
            p2.setPropertyType("Apartment");
            p2.setCreatedBy(adminUser);
            propertyRepository.save(p2);
        }
        if (!propertyRepository.existsById(3L)) {
            Property p3 = new Property();
            p3.setPropertyName("Independent House");
            p3.setAddress("88, Jubilee Hills, Road No. 36");
            p3.setCity("Hyderabad");
            p3.setState("Telangana");
            p3.setZipCode("500033");
            p3.setPropertyType("House");
            p3.setCreatedBy(adminUser);
            propertyRepository.save(p3);
        }
        if (!propertyRepository.existsById(4L)) {
            Property p4 = new Property();
            p4.setPropertyName("Premium Flat");
            p4.setAddress("102, Green Glen Layout, Bellandur");
            p4.setCity("Bangalore");
            p4.setState("Karnataka");
            p4.setZipCode("560103");
            p4.setPropertyType("Flat");
            p4.setCreatedBy(adminUser);
            propertyRepository.save(p4);
        }

        // Clean up any extraneous properties with ID > 4 to maintain exact 4 properties
        List<Property> allProps = propertyRepository.findAll();
        for (Property prop : allProps) {
            if (prop.getPropertyId() > 4L) {
                Long pid = prop.getPropertyId();
                try {
                    reportHistoryRepository.deleteAll(reportHistoryRepository.findByPropertyPropertyIdOrderByGeneratedAtDesc(pid));
                    dueDiligenceReportRepository.deleteAll(dueDiligenceReportRepository.findByPropertyPropertyId(pid));
                    riskAssessmentRepository.deleteAll(riskAssessmentRepository.findByPropertyPropertyId(pid));
                    zoningRepository.findByProperty_PropertyId(pid).ifPresent(zoningRepository::delete);
                    propertyTaxHistoryRepository.deleteAll(propertyTaxHistoryRepository.findByProperty_PropertyId(pid));
                    floodZoneRepository.findByPropertyPropertyId(pid).ifPresent(floodZoneRepository::delete);
                    permitRepository.deleteAll(permitRepository.findByPropertyPropertyId(pid));
                    propertyRepository.delete(prop);
                } catch (Exception e) {
                    // Suppress constraint issues if already handled
                }
            }
        }

        // Seed rich due diligence data for the 4 baseline properties
        List<Property> baselineProps = propertyRepository.findAll();
        for (Property prop : baselineProps) {
            Long pid = prop.getPropertyId();
            if (pid > 4L) continue;

            // 1. Seed Zoning if not exists
            if (zoningRepository.findByProperty_PropertyId(pid).isEmpty()) {
                Zoning z = new Zoning();
                z.setProperty(prop);
                String type = prop.getPropertyType() != null ? prop.getPropertyType() : "Residential";
                if (type.equalsIgnoreCase("Commercial") || type.equalsIgnoreCase("Flat") || type.equalsIgnoreCase("Apartment")) {
                    z.setZoningCategory("Commercial / Multi-Family");
                    z.setZoningClass("C-2 / R-4 Mixed Density");
                    z.setPlanningAuthority("Metropolitan Development Authority");
                    z.setMasterPlan("Master Plan 2031");
                    z.setParcelIdentifier("PARCEL-COM-" + pid);
                    z.setComplianceStatus("COMPLIANT");
                    z.setMaxFar(2.5);
                    z.setMaxHeight("24 meters / 7 floors");
                    z.setGroundCoverage("60%");
                    z.setMinPlotArea("5000 sq.ft");
                    z.setFrontSetback("6 meters");
                    z.setRearSetback("4.5 meters");
                    z.setLeftSetback("3 meters");
                    z.setRightSetback("3 meters");
                    z.setPermittedUsage("Office, Retail, Multi-Family Residential, Commercial");
                    z.setRestrictedUsage("Heavy Manufacturing, Chemical Storage");
                    z.setSpecialRegulations("Standard commercial fire safety and parking ratios apply.");
                } else {
                    z.setZoningCategory("Residential");
                    z.setZoningClass("R-1 Single Family Residential");
                    z.setPlanningAuthority("Municipal Planning Board");
                    z.setMasterPlan("Master Plan 2031");
                    z.setParcelIdentifier("PARCEL-RES-" + pid);
                    z.setComplianceStatus("COMPLIANT");
                    z.setMaxFar(1.8);
                    z.setMaxHeight("15 meters / 3 floors");
                    z.setGroundCoverage("50%");
                    z.setMinPlotArea("2400 sq.ft");
                    z.setFrontSetback("4.5 meters");
                    z.setRearSetback("3 meters");
                    z.setLeftSetback("2.5 meters");
                    z.setRightSetback("2.5 meters");
                    z.setPermittedUsage("Single-Family Dwelling, Villa, Home Office");
                    z.setRestrictedUsage("Heavy Commercial, Industrial Activity");
                    z.setSpecialRegulations("Residential height and setback covenants active.");
                }
                zoningRepository.save(z);
            }

            // 2. Seed Tax History if not exists
            if (propertyTaxHistoryRepository.findByProperty_PropertyId(pid).isEmpty()) {
                double baseTax = 4200.0 + (pid * 350.0);
                String s2021 = "PAID";
                String s2022 = "PAID";
                String s2023 = (pid == 4L) ? "UNPAID" : "PAID";
                String s2024 = (pid == 3L) ? "DELAYED" : (pid == 4L) ? "UNPAID" : "PAID";

                propertyTaxHistoryRepository.save(new PropertyTaxHistory(null, 2021, Math.round(baseTax * 100.0) / 100.0, s2021, prop));
                propertyTaxHistoryRepository.save(new PropertyTaxHistory(null, 2022, Math.round((baseTax * 1.06) * 100.0) / 100.0, s2022, prop));
                propertyTaxHistoryRepository.save(new PropertyTaxHistory(null, 2023, Math.round((baseTax * 1.12) * 100.0) / 100.0, s2023, prop));
                propertyTaxHistoryRepository.save(new PropertyTaxHistory(null, 2024, Math.round((baseTax * 1.18) * 100.0) / 100.0, s2024, prop));
            }

            // 3. Seed Flood Zone if not exists
            if (floodZoneRepository.findByPropertyPropertyId(pid).isEmpty()) {
                FloodZone fz = new FloodZone();
                fz.setProperty(prop);
                if (pid == 1L) {
                    fz.setZone("Zone X (Minimal Risk)");
                    fz.setBaseFloodElevation(14.5);
                    fz.setInsuranceRequired(false);
                    fz.setNearestWaterBody("Municipal Drainage Channel / Lake");
                    fz.setDistanceToWaterBody(1.8);
                    fz.setFemaPanel("FEMA-MAP-48201C1001");
                } else if (pid == 2L) {
                    fz.setZone("Zone X (Shaded - Low Risk)");
                    fz.setBaseFloodElevation(12.0);
                    fz.setInsuranceRequired(false);
                    fz.setNearestWaterBody("Bellandur Stormwater Basin");
                    fz.setDistanceToWaterBody(1.2);
                    fz.setFemaPanel("FEMA-MAP-48201C1002");
                } else if (pid == 3L) {
                    fz.setZone("Zone AE (Moderate Flood Risk)");
                    fz.setBaseFloodElevation(8.5);
                    fz.setInsuranceRequired(true);
                    fz.setNearestWaterBody("Noyyal River Tributary Channel");
                    fz.setDistanceToWaterBody(0.4);
                    fz.setFemaPanel("FEMA-MAP-48201C1003");
                } else {
                    fz.setZone("Zone VE (High Risk River Basin)");
                    fz.setBaseFloodElevation(4.2);
                    fz.setInsuranceRequired(true);
                    fz.setNearestWaterBody("Musi River Basin & Wetland Buffer");
                    fz.setDistanceToWaterBody(0.08);
                    fz.setFemaPanel("FEMA-MAP-48201C1004");
                }
                floodZoneRepository.save(fz);
            }

            // 4. Seed Building Permits if not exists
            if (permitRepository.findByPropertyPropertyId(pid).isEmpty()) {
                Permit p1 = new Permit();
                p1.setProperty(prop);
                p1.setPermitNumber("BLD-2023-" + (1000 + pid));
                p1.setPermitType("Building Construction Permit");
                p1.setAuthority("Municipal Development Authority");
                p1.setStatus("APPROVED");
                p1.setIssueDate(LocalDate.of(2023, 3, 15));
                p1.setApprovalDate(LocalDate.of(2023, 4, 10));
                p1.setContractor("Apex Structural Engineering");
                p1.setInspector("R. Henderson (Senior Inspector)");
                p1.setNotes("Foundation, structural frame, and MEP systems verified compliant with local code.");
                permitRepository.save(p1);

                Permit p2 = new Permit();
                p2.setProperty(prop);
                p2.setPermitNumber("OCC-2024-" + (2000 + pid));
                p2.setPermitType("Certificate of Occupancy");
                p2.setAuthority("City Fire & Safety Department");
                p2.setStatus("APPROVED");
                p2.setIssueDate(LocalDate.of(2024, 1, 20));
                p2.setApprovalDate(LocalDate.of(2024, 2, 5));
                p2.setContractor("Apex Structural Engineering");
                p2.setInspector("M. Davis (Fire Marshal)");
                p2.setNotes("Final occupancy inspection passed. Fire exits, alarms, and life safety measures certified.");
                permitRepository.save(p2);
            }

            // 5. Seed Due Diligence Report & Risk Assessment with exact baseline scores
            if (dueDiligenceReportRepository.findByPropertyPropertyId(pid).isEmpty()) {
                DueDiligenceReport report = new DueDiligenceReport();
                report.setProperty(prop);
                report.setRequestedBy(adminUser);
                report.setCreatedAt(LocalDateTime.now().minusDays(2));
                report.setCompletedAt(LocalDateTime.now().minusDays(2));
                report.setStatus("COMPLETED");
                report.setDurationMs(1420L);

                RiskAssessment ra = new RiskAssessment();
                ra.setProperty(prop);
                ra.setCreatedAt(LocalDateTime.now().minusDays(2));
                ra.setAssessedAt(LocalDateTime.now().minusDays(2));

                if (pid == 1L) {
                    report.setRiskScore(98);
                    report.setRiskLevel("LOW");
                    report.setReportSnapshot("{\"trustScore\":98,\"riskLevel\":\"LOW\",\"summary\":\"Clean ownership history, valid registered deed, tax paid up to date, zero liens/encumbrances. Highly recommended for acquisition.\"}");
                    
                    ra.setRiskScore(98);
                    ra.setOverallRiskScore(98);
                    ra.setRiskLevel("LOW");
                    ra.setTitleRiskScore(2);
                    ra.setTaxRiskScore(0);
                    ra.setZoningRiskScore(0);
                    ra.setFloodRiskScore(0);
                    ra.setEnvironmentalRiskScore(0);
                    ra.setComments("Clean ownership history, valid registered deed, tax paid up to date, zero liens/encumbrances.");
                    ra.setMitigationRecommendations("Proceed with purchase agreement; standard title deed registration recommended.");
                } else if (pid == 2L) {
                    report.setRiskScore(90);
                    report.setRiskLevel("LOW");
                    report.setReportSnapshot("{\"trustScore\":90,\"riskLevel\":\"LOW\",\"summary\":\"Ownership clear, municipal tax payments up to date. Recommended with low risk profile.\"}");
                    
                    ra.setRiskScore(90);
                    ra.setOverallRiskScore(90);
                    ra.setRiskLevel("LOW");
                    ra.setTitleRiskScore(4);
                    ra.setTaxRiskScore(3);
                    ra.setZoningRiskScore(2);
                    ra.setFloodRiskScore(1);
                    ra.setEnvironmentalRiskScore(0);
                    ra.setComments("Ownership clear, municipal tax payments up to date.");
                    ra.setMitigationRecommendations("Verify latest society NOC before registration.");
                } else if (pid == 3L) {
                    report.setRiskScore(65);
                    report.setRiskLevel("MEDIUM");
                    report.setReportSnapshot("{\"trustScore\":65,\"riskLevel\":\"MEDIUM\",\"summary\":\"Pending probate verification and unrecorded inheritance transfer deed.\"}");
                    
                    ra.setRiskScore(65);
                    ra.setOverallRiskScore(65);
                    ra.setRiskLevel("CONCERNS_FOUND");
                    ra.setTitleRiskScore(20);
                    ra.setTaxRiskScore(10);
                    ra.setZoningRiskScore(3);
                    ra.setFloodRiskScore(2);
                    ra.setEnvironmentalRiskScore(0);
                    ra.setComments("Pending probate verification and unrecorded inheritance transfer deed.");
                    ra.setMitigationRecommendations("Require legal succession certificate from seller before executing sale agreement.");
                } else if (pid == 4L) {
                    report.setRiskScore(32);
                    report.setRiskLevel("HIGH");
                    report.setReportSnapshot("{\"trustScore\":32,\"riskLevel\":\"HIGH\",\"summary\":\"Active title litigation lawsuit, municipal tax attachment lien, and wetland buffer zone encroachment.\"}");
                    
                    ra.setRiskScore(32);
                    ra.setOverallRiskScore(32);
                    ra.setRiskLevel("HIGH_RISK");
                    ra.setTitleRiskScore(35);
                    ra.setTaxRiskScore(20);
                    ra.setZoningRiskScore(8);
                    ra.setFloodRiskScore(3);
                    ra.setEnvironmentalRiskScore(2);
                    ra.setComments("Active title litigation lawsuit, municipal tax attachment lien, and wetland buffer zone encroachment.");
                    ra.setMitigationRecommendations("DO NOT PROCEED. Unresolved high-court litigation and municipal tax lien attach to parcel.");
                }

                riskAssessmentRepository.save(ra);
                dueDiligenceReportRepository.save(report);
            }
        }
    }
}

