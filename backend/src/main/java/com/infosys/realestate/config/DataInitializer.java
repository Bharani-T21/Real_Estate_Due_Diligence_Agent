package com.infosys.realestate.config;

import com.infosys.realestate.entity.*;
import com.infosys.realestate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
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

        if (propertyRepository.count() < 4) {
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
        }

        // Seed rich due diligence data for all properties
        List<Property> allProperties = propertyRepository.findAll();
        for (Property prop : allProperties) {
            Long pid = prop.getPropertyId();

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
                propertyTaxHistoryRepository.save(new PropertyTaxHistory(null, 2021, Math.round(baseTax * 100.0) / 100.0, "PAID", prop));
                propertyTaxHistoryRepository.save(new PropertyTaxHistory(null, 2022, Math.round((baseTax * 1.06) * 100.0) / 100.0, "PAID", prop));
                propertyTaxHistoryRepository.save(new PropertyTaxHistory(null, 2023, Math.round((baseTax * 1.12) * 100.0) / 100.0, "PAID", prop));
                propertyTaxHistoryRepository.save(new PropertyTaxHistory(null, 2024, Math.round((baseTax * 1.18) * 100.0) / 100.0, "PAID", prop));
            }

            // 3. Seed Flood Zone if not exists
            if (floodZoneRepository.findByPropertyPropertyId(pid).isEmpty()) {
                FloodZone fz = new FloodZone();
                fz.setProperty(prop);
                fz.setZone("Zone X (Minimal Risk)");
                fz.setBaseFloodElevation(12.5);
                fz.setInsuranceRequired(false);
                fz.setNearestWaterBody("Municipal Drainage Channel / Lake");
                fz.setDistanceToWaterBody(1.8);
                fz.setFemaPanel("FEMA-MAP-48201C" + (1000 + pid));
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
        }
    }
}

