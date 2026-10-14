export declare const ANGULAR_ELEMENT_ABBREVIATIONS: Record<string, string>;
export declare const ANGULAR_PROP_ABBREVIATIONS: Record<string, string>;
export declare const KNOWN_ANGULAR_EVENTS: Set<string>;
export declare function resolveAngularElementTag(name: string): {
    tag: string;
    isIntrinsic: boolean;
};
export declare function isIntrinsicTag(tag: string): boolean;
export declare function isCustomComponentName(name: string): boolean;
export declare function extractAngularInterpolations(text: string): string[];
export declare function normalizeAngularInterpolation(text: string): string;
