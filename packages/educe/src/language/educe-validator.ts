import type { ValidationAcceptor, ValidationChecks } from "langium";
import type { EduceServices } from "./educe-module.js";
import type { EduceAstType, Person } from "./generated/ast.js";

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: EduceServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.EduceValidator;
    const checks: ValidationChecks<EduceAstType> = {
        Person: validator.checkPersonStartsWithCapital,
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class EduceValidator {
    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept("warning", "Person name should start with a capital.", {
                    node: person,
                    property: "name",
                });
            }
        }
    }
}
