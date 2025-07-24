# AI Development Guidelines - Vue 3 + TypeScript + Quasar Project

## 🤖 AI Instructions Overview

This document provides specific rules and patterns for AI assistants working on this Vue 3 + TypeScript + Quasar project with modular DDD architecture.

## 📁 Project Structure Rules

### REQUIRED: Modular Architecture
```

src/
├── components/         → Global reusable UI components (.vue files)
├── composables/       → Global reusable logic (.ts files)
├── layouts/           → Layout components (.vue files)
├── pages/             → Route components (.vue files)
├── router/            → Router configuration
├── modules/           → Feature modules (DDD structure)
│   └── [module-name]/
│       ├── domain/           → Business logic & entities
│       │   ├── entities/     → Domain entities (.entity.ts)
│       │   ├── enums/        → Domain enums (.enum.ts)
│       │   └── value-objects/ → Value objects (.enum.ts)
│       ├── dtos/            → Data transfer objects (.dto.ts)
│       ├── mappers/         → Data mappers (.mapper.ts)  
│       ├── services/        → Application services (.service.ts)
│       ├── stores/          → Pinia stores (.store.ts)
│       └── presentation/    → UI components & pages
│           ├── components/  → Module-specific components
│           └── pages/       → Module-specific pages
└── css/               → Global styles
```
### MANDATORY: Naming Conventions

#### Files and Directories
- **Modules**: kebab-case (`auth`, `teams`, `players`)
- **Entities**: PascalCase + `.entity.ts` (e.g., `Player.entity.ts`)
- **DTOs**: PascalCase + `.dto.ts` (e.g., `CreateTeamByScrapingDto`)
- **Services**: PascalCase + `.service.ts` (e.g., `AuthService`)
- **Stores**: camelCase + `.store.ts` (e.g., `auth.store.ts`)
- **Mappers**: PascalCase + `.mapper.ts` (e.g., `LoginMapper`)
- **Enums**: PascalCase + `.enum.ts` (e.g., `PlayerPosition`)
- **Components**: PascalCase + `.vue` (e.g., `PlayerCard.vue`)
- **Pages**: PascalCase + `.vue` (e.g., `HomePage.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useQuasarNotifications`)

#### Code Naming
- **Classes**: PascalCase (`Player`, `AuthService`, `LoginMapper`)
- **Interfaces**: PascalCase without prefix (`CreateTeamByScrapingDto`)
- **Types**: PascalCase (`PlayerPosition`, `Role`)
- **Enums**: PascalCase (`PlayerWildcardType`)
- **Variables**: camelCase (`accessToken`, `isAuthenticated`)
- **Functions**: camelCase (`setTokens`, `clearTokens`)
- **Constants**: UPPER_SNAKE_CASE (`CACHE_KEYS`, `MESSAGES`)

## 🎯 Code Generation Templates

### Template 1: Domain Entity
```
typescript
// modules/[module]/domain/entities/[entity].entity.ts
export class [EntityName] {
id: number;
uuid: string;
[property]: [type];
[optionalProperty]?: [type] | null;
createdAt?: Date;
updatedAt?: Date;

constructor(data: Partial<[EntityName]> = {}) {
this.id = data.id || 0;
this.uuid = data.uuid || '';
this.[property] = data.[property] || [defaultValue];

    if (data.[optionalProperty]) this.[optionalProperty] = data.[optionalProperty];
    if (data.createdAt) this.createdAt = new Date(data.createdAt);
    if (data.updatedAt) this.updatedAt = new Date(data.updatedAt);
}

get [computedProperty](): [returnType] {
return [computation];
}
}
```
### Template 2: DTO Interface
```
typescript
// modules/[module]/dtos/[action].dto.ts
export interface [ActionName]Dto {
[requiredProperty]: [type];
[optionalProperty]?: [type];
[property: string]: any; // For additional properties when needed
}
```
### Template 3: Application Service
```
typescript
// modules/[module]/services/[service].service.ts
import type { [DtoName] } from '../dtos/[dto-file].dto';
import type { [EntityName] } from '../domain/entities/[entity].entity';

export class [ServiceName]Service {
private baseUrl = '[api-endpoint]';

async [methodName]([params]: [types]): Promise<[returnType]> {
try {
// Service implementation
return [result];
} catch (error) {
console.error(`Error in ${[ServiceName]Service.name}.[methodName]:`, error);
throw error;
}
}
}
```
### Template 4: Pinia Store (Module-specific)
```
typescript
// modules/[module]/stores/[module].store.ts
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useMutation, useQuery, useQueryCache } from '@pinia/colada';
import { [ServiceName]Service } from '../services/[service].service';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import type { [DtoName] } from '../dtos/[dto].dto';

const CACHE_KEYS = {
[OPERATION]: ['[cache-key]'] as const,
} as const;

export const use[ModuleName]Store = defineStore('[moduleName]', () => {
const notifications = useQuasarNotifications();
const queryCache = useQueryCache();

// Services
const [serviceName]Service = new [ServiceName]Service();

// State
const [stateName] = ref<[type]>([initialValue]);

// Computed
const [computedName] = computed(() => [computation]);

// Cache invalidation
const invalidate[Operation]Cache = async () => {
await queryCache.invalidateQueries({ key: CACHE_KEYS.[OPERATION] });
};

// Mutations
const [operationName]Mutation = useMutation({
mutation: ([params]: [types]) => [serviceName]Service.[method]([params]),
async onSuccess([data]) {
// Handle success
await invalidate[Operation]Cache();
},
onError(error) {
notifications.notifyError('Error message');
throw error;
},
});

return {
// State
[stateName],

    // Computed
    [computedName],
    
    // Actions
    [operationName]: [operationName]Mutation.mutateAsync,
    
    // Loading states
    [operationName]Loading: [operationName]Mutation.isLoading,
    
    // Errors
    [operationName]Error: [operationName]Mutation.error,
    
    // Data
    [operationName]Data: [operationName]Mutation.data,
};
});
```
### Template 5: Data Mapper
```
typescript
// modules/[module]/mappers/[mapper].mapper.ts
import type { [SourceType] } from '../types/[source].type';
import type { [TargetType] } from '../dtos/[target].dto';

export class [MapperName]Mapper {
static toDto(source: [SourceType]): [TargetType] {
return {
[property]: source.[property],
// Map properties
};
}

static fromDto(dto: [TargetType]): [SourceType] {
return {
[property]: dto.[property],
// Map properties back
};
}

static toDtoArray(sources: [SourceType][]): [TargetType][] {
return sources.map(source => this.toDto(source));
}
}
```
### Template 6: Module Component
```
typescript
// modules/[module]/presentation/components/[Component].vue
<template>
  <div class="[component-name-kebab]">
    <!-- Component template -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { use[ModuleName]Store } from '../../stores/[module].store';
import type { [EntityName] } from '../../domain/entities/[entity].entity';

interface Props {
  [propName]: [type];
  [optionalProp]?: [type];
}

const props = withDefaults(defineProps<Props>(), {
  [optionalProp]: [defaultValue]
});

const emit = defineEmits<{
  [eventName]: [[paramType]];
}>();

// Store
const [moduleName]Store = use[ModuleName]Store();

// Local state
const [stateName] = ref<[type]>([initialValue]);

// Computed
const [computedName] = computed(() => [computation]);

// Methods
const handle[ActionName] = ([params]: [types]) => {
  // Method implementation
};

onMounted(() => {
  // Component initialization
});
</script>

<style scoped lang="scss">
.[component-name-kebab] {
  // Component styles
}
</style>
```
### Template 7: Enum/Value Object
```typescript
// modules/[module]/domain/enums/[enum-name].enum.ts
export enum [EnumName] {
  [VALUE_ONE] = '[value-one]',
  [VALUE_TWO] = '[value-two]',
}

// For complex enums with additional data
export const [EnumName]Config = {
  [VALUE_ONE]: {
    label: '[Label One]',
    description: '[Description]',
    [additionalProperty]: [value],
  },
  [VALUE_TWO]: {
    label: '[Label Two]',
    description: '[Description]',
    [additionalProperty]: [value],
  },
} as const;

export type [EnumName]Type = keyof typeof [EnumName]Config;
```
```


## 🔧 AI-Specific Rules

### RULE 1: Module Organization
Always organize code within the appropriate module:
- **Business logic**: `domain/entities/`
- **Data contracts**: `dtos/`
- **External services**: `services/`
- **State management**: `stores/`
- **Data transformation**: `mappers/`
- **UI components**: `presentation/components/`
- **Pages**: `presentation/pages/`

### RULE 2: Entity Construction Pattern
Always use the constructor pattern shown in existing entities:
```typescript
constructor(data: Partial<[EntityName]> = {}) {
  this.id = data.id || 0;
  this.requiredProperty = data.requiredProperty || defaultValue;
  
  if (data.optionalProperty) this.optionalProperty = data.optionalProperty;
}
```


### RULE 3: Store Pattern with Pinia Colada
Always use the established pattern:
- Use `useMutation` for write operations
- Use `useQuery` for read operations
- Include cache invalidation
- Handle loading and error states
- Use `useQuasarNotifications` for user feedback

### RULE 4: Import Organization
Follow this exact order:
1. Vue core imports
2. External library imports (Pinia, Quasar, etc.)
3. Services from current module
4. Composables from global scope
5. Types/DTOs from current module
6. Constants

### RULE 5: Type Definitions
- **DTOs**: Use interfaces without prefixes
- **Entities**: Use classes with constructor pattern
- **Enums**: Use TypeScript enums
- **Complex types**: Define in separate files when reused

### RULE 6: File Placement Logic
When creating new files:
1. **Business logic**: Place in appropriate module's `domain/` folder
2. **API contracts**: Place in module's `dtos/` folder
3. **Services**: Place in module's `services/` folder
4. **UI components**: Place in module's `presentation/components/`
5. **Global components**: Place in root `components/` folder
6. **Global composables**: Place in root `composables/` folder

### RULE 7: Error Handling Pattern
Always use this pattern in services:
```typescript
async [methodName]([params]: [types]): Promise<[returnType]> {
  try {
    // Implementation
    return result;
  } catch (error) {
    console.error(`Error in ${ClassName}.[methodName]:`, error);
    throw error;
  }
}
```


### RULE 8: Constants Organization
Place constants in appropriate locations:
- **Module-specific**: Within the module
- **Global**: In `modules/shared/constants/`
- **Cache keys**: Within store files as `CACHE_KEYS`

## 🚨 AI Restrictions

### NEVER DO:
- Create files outside the established module structure
- Use `I` prefix for interfaces (project doesn't use it)
- Mix different naming conventions within the same module
- Skip the constructor pattern in entities
- Create stores without cache invalidation
- Forget error handling in services

### ALWAYS DO:
- Follow the existing DDD module structure
- Use the established naming conventions
- Include proper TypeScript typing
- Use the constructor pattern for entities
- Implement cache invalidation in stores
- Handle loading and error states
- Use `useQuasarNotifications` for user feedback

## 🎯 AI Code Quality Checklist

Before generating code, ensure:
- [ ] File is placed in correct module and folder
- [ ] Naming follows project conventions
- [ ] Entities use constructor pattern
- [ ] Stores include cache invalidation
- [ ] Services have proper error handling
- [ ] All types are properly defined
- [ ] Imports are organized correctly
- [ ] Constants are properly defined

## 📋 AI Response Format

When providing code solutions:
1. **Identify the correct module** for the functionality
2. **Choose appropriate folder** within the module structure
3. **Follow established patterns** from existing code
4. **Use consistent naming** throughout
5. **Include proper error handling** and loading states
