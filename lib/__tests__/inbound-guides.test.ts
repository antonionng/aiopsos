import { isPublicPath } from '../public-routes.ts';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { hrAndAgenticGuides } from '../insights/articles/hr-and-agentic-guides.ts';
import { getInsightBySlug, getPublishedInsights, getInsightsByTopic } from '../insights/catalog.ts';
import { INSIGHT_TOPIC_PAGES } from '../insights/topics.ts';
import { COURSE_TITLES } from '../published-course-slugs.ts';
import { buildPublicSitemap } from '../public-sitemap.ts';

test('inbound guides have working course, article and worksheet destinations', () => {
  for (const article of hrAndAgenticGuides) {
    assert.equal(getInsightBySlug(article.slug), article);
    for (const course of article.relatedCourseSlugs) assert.ok(COURSE_TITLES[course], course);
    for (const [,href] of article.body.matchAll(/\]\((\/[^)]+)\)/g)) {
      const url = new URL(href, 'https://experrt.com');
      if (url.pathname.startsWith('/insights/')) assert.ok(getInsightBySlug(url.pathname.slice(10)), href);
      else if (url.pathname.startsWith('/courses/')) assert.ok(COURSE_TITLES[url.pathname.slice(9)], href);
      else if (url.pathname.startsWith('/resources/')) assert.ok(existsSync(`public${url.pathname}`), href);
      else assert.ok(['/','/contact','/courses'].includes(url.pathname), href);
    }
  }
});
test('all article subjects have a populated crawlable page included in the sitemap', () => {
  const sitemap = buildPublicSitemap({baseUrl:'https://experrt.com',courseSlugs:[]});
  for (const article of getPublishedInsights()) assert.ok(INSIGHT_TOPIC_PAGES.some(entry=>entry.topic===article.topic));
  for (const entry of INSIGHT_TOPIC_PAGES) {
    assert.ok(getInsightsByTopic(entry.topic).length);
    assert.ok(sitemap.some(item=>item.url===`https://experrt.com/insights/topic/${entry.slug}`));
  }
  for (const article of hrAndAgenticGuides) assert.ok(sitemap.some(item=>item.url===`https://experrt.com/insights/${article.slug}`));
});

test('the public worksheet is ungated without exposing learning resources', () => {
  assert.equal(isPublicPath('/resources/hr-automation-checklist.csv'), true);
  assert.equal(isPublicPath('/resources/private-pack.csv'), false);
  assert.equal(isPublicPath('/dashboard/resources'), false);
});
