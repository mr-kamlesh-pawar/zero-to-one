"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { courseData } from "@/data/courseData";

export function Hero() {
  const router = useRouter();
  const { user } = useAuth();
  const { hero, author } = courseData;

  const handleEnterLab = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user?.isSubscribed) {
      router.push("/labs");
    } else {
      router.push("/subscription");
    }
  };

  return (
    <section className="hero">
      <div className="hero-bg" />

      <div className="hero-content">
        {/* Eyebrow */}
        <div className="eyebrow">
          <span className="eyebrow-line" />
          <span className="eyebrow-text">{hero.eyebrow}</span>
        </div>

        {/* Course title */}
        <h1 className="course-title">
          <span className="t-zero">{hero.titleZero}</span>
          <span className="t-to">{hero.titleTo}</span>
          <span className="t-one">{hero.titleOne}</span>
        </h1>

        {/* Tagline */}
        <p className="tagline">{hero.tagline}</p>

        {/* Description */}
        <p className="description">{hero.description}</p>

        <div className="divider" />

        {/* Stats */}
        <div className="stats">
          {hero.stats.map((stat, idx) => (
            <div key={idx} className="stat">
              <strong>{stat.highlight}</strong>
              <span>&nbsp;{stat.text}</span>
            </div>
          ))}
        </div>

        {/* Rating */}
        <div className="rating">
          <div className="stars">{hero.rating.stars}</div>
          <div className="rating-val">{hero.rating.value}</div>
          <div className="rating-sep" />
          <div className="rating-detail">
            {hero.rating.detailLine1}
            <br />
            {hero.rating.detailLine2}
          </div>
        </div>

        {/* CTA */}
        <div className="cta-row">
          <a
            href="/subscription"
            onClick={handleEnterLab}
            className="btn-primary"
          >
            {hero.cta.primary.label} &nbsp;<span className="arrow">→</span>
          </a>
          <a
            href={hero.cta.secondary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            {hero.cta.secondary.label}
          </a>
        </div>

        {/* Author Card */}
        <div className="author-card">
          <Image
            className="author-photo"
            src={author.avatar}
            alt={author.name}
            width={66}
            height={66}
            priority
          />
          <div className="author-info">
            <div className="author-role">{author.role}</div>
            <div className="author-name">{author.name}</div>
            <div className="author-title">{author.title}</div>
            <div className="author-tags">
              {author.tags.map((tag, idx) => (
                <span key={idx} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
