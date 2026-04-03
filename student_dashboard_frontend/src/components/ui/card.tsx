import type { ComponentProps } from "react";
import {
	Card as BaseCard,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "./utils";

type CardVariant = "default" | "metric" | "panel";

const cardVariantClasses: Record<CardVariant, string> = {
	default: "",
	metric: "",
	panel: "",
};

interface CardProps extends ComponentProps<typeof BaseCard> {
	variant?: CardVariant;
}

function Card({ className, variant = "default", ...props }: CardProps) {
	return <BaseCard className={cn(cardVariantClasses[variant], className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
