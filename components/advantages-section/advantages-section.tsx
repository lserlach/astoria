"use client";

import {
  CreditCard,
  GlobeHemisphereWest,
  HandHeart,
  Headset,
  Medal,
  ThumbsUp,
  TrendUp,
  Users,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";

import { Container } from "@/components/container/container";
import type { AdvantageIconId, AdvantageItem } from "@/lib/api/types";

import styles from "./advantages-section.module.css";

const ICONS: Record<
  AdvantageIconId,
  ComponentType<{ className?: string; size?: number; weight?: "regular"; "aria-hidden"?: boolean }>
> = {
  headset: Headset,
  creditCard: CreditCard,
  thumbsUp: ThumbsUp,
  handHeart: HandHeart,
  users: Users,
  globe: GlobeHemisphereWest,
  medal: Medal,
  trendUp: TrendUp,
};

interface AdvantagesSectionProps {
  id?: string;
  items: AdvantageItem[];
}

export function AdvantagesSection({ id, items }: AdvantagesSectionProps) {
  return (
    <section
      id={id}
      className={styles.section}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <Container>
        <div className={styles.block}>
          <h2 className={styles.heading} id={id ? `${id}-heading` : undefined}>
            Наши преимущества
          </h2>
          <div className={styles.grid}>
            {items.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <div key={item.id} className={styles.cell}>
                  <Icon
                    className={styles.icon}
                    size={48}
                    weight="regular"
                    aria-hidden
                  />
                  <div className={styles.text}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <p className={styles.desc}>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
