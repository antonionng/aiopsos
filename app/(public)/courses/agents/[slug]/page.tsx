import { withSiteShareImages } from "@/lib/social-image";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getAgentMarketingCourse,
  agentMarketingCourses,
} from "@/lib/always-on-agents/marketing";
import { CourseEnquiryForm } from "@/components/course-enquiry-form";
import { AgentCoursePurchase } from "@/components/courses/agent-course-purchase";
import { getAgentCourseOffer } from "@/lib/always-on-agents/commerce";
import { agentCourseMetadata, agentCourseGraph, agentCourseFaqs } from "@/lib/always-on-agents/seo";
import { getPublicSiteUrl } from "@/lib/site";
import { StructuredData } from "@/components/structured-data";
import "../agent-detail.css";
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return agentMarketingCourses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getAgentMarketingCourse(slug);
  if (!course) return withSiteShareImages({ title: "Course not found" });
  return withSiteShareImages(agentCourseMetadata(course, getPublicSiteUrl()));
}

export default async function AgentCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getAgentMarketingCourse(slug);
  if (!course) notFound();
  const offer = await getAgentCourseOffer(slug).catch(() => null);
  return (
    <article className="agent-course-detail">
      <StructuredData data={agentCourseGraph(course, getPublicSiteUrl(), offer)} />
      <Link className="agent-detail-back" href="/courses/agents">
        <ArrowLeft size={17} /> All agent courses
      </Link>
      <header className="agent-detail-hero">
        <div>
          <p className="agent-detail-eyebrow">
            EXPERRT ACADEMY / {course.group.toUpperCase()}
          </p>
          <h1>{course.title}</h1>
          <p className="agent-detail-summary">{course.summary}</p>
          <div className="agent-detail-tags">
            <span>{offer ? "Open for enrolment" : "Coming soon"}</span>
            <span>Six modules</span>
            <span>Final practical project</span>
          </div>
          <p className="agent-detail-price">
            £99 <span>{offer ? "Course price" : "Planned course price"}</span>
          </p>
          <div className="agent-detail-actions">
            {process.env.NODE_ENV !== "production" ? (
              <Link href={`/courses/agents/review/${course.slug}`}>
                Review the complete course <ArrowRight size={17} />
              </Link>
            ) : null}
            {offer ? <AgentCoursePurchase compact slug={course.slug} termsVersion={offer.terms_version} termsUrl={offer.terms_url} priceGbp={Math.round(offer.amount / 100)} placement="agent_course_hero" /> : <a href="#course-interest">Enquire about availability <ArrowRight size={17} /></a>}
            <a href="#agent-course-outline">Explore the course outline ↓</a>
          </div>
        </div>
        <Image
          src={course.image}
          alt={`Editorial illustration for ${course.title}, showing agent-assisted work and human review.`}
          width={1536}
          height={1024}
          sizes="(max-width: 800px) 100vw, 45vw"
          priority
        />
      </header>
      <div className="agent-detail-layout">
        <div>
          <section>
            <h2>Who this course is for</h2>
            <p>{course.audience}</p>
            <h3>Before you start</h3>
            <p>
              {course.prerequisites} Any subscription or eligible account for the platform you study is separate from the course fee. Check that you have the access described above before buying.
            </p>
          </section>
          <section id="agent-course-outline">
            <h2>What the six modules cover</h2>
            <p>
              The course uses pictures, step-by-step explanations, examples,
              questions with feedback and practical exercises. Each module helps
              you produce part of your final project. Your purchased course includes 12 months of access and account-saved notes.
            </p>
            <ol className="agent-detail-modules">
              {course.modules.map((module, index) => (
                <li key={module.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{module.title}</h3>
                    <p>
                      <strong>What you will make or keep:</strong>{" "}
                      {module.evidence}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="agent-detail-project">
            <p className="agent-detail-eyebrow">YOUR FINAL PRACTICAL PROJECT</p>
            <h2>Try what you have learned on a regular task</h2>
            <p>{course.capstone}</p>
          </section>
          <section>
            <h2>How your learning will be assessed</h2>
            <p>
              For your AI assessment, you will share your project, the
              checks you made and an explanation of your choices. The AI
              assessor will check the submitted evidence of how you planned the task, chose permissions,
              ran the work, checked the results, fixed problems and worked out
              whether the agent helped.
            </p>
            <p>
              If part of the work needs improvement, you will receive feedback
              and an opportunity to revise it. Your Experrt certificate
              is awarded after the AI assessment confirms you have passed every
              required skill area. You need at least 3 out of 4 in each of the six skill areas. Your fee includes up to twenty completed AI assessments, with a limit of three in 24 hours. AI checks the text you submit; it cannot open external links, operate your account or independently verify authorship. Your certificate records this assessment method and is not an externally accredited qualification.
            </p>
          </section>
          <section id="course-questions">
            <h2>Questions about this course</h2>
            {agentCourseFaqs(course).map(faq => <div key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></div>)}
          </section>
        </div>
        <aside className="agent-detail-enquiry" id="course-interest">
          <p className="agent-detail-eyebrow">{offer ? "ENROL IN THIS COURSE" : "COURSE AVAILABILITY"}</p>
          <h2>
            {offer
              ? "Start learning with Experrt"
              : "Interested in this course?"}
          </h2>
          {offer ? (
            <AgentCoursePurchase
              slug={slug}
              termsVersion={offer.terms_version}
              termsUrl={offer.terms_url}
              priceGbp={Math.round(offer.amount / 100)}
              placement="agent_course_page"
            />
          ) : (
            <>
              <p>
                This course is being developed and is not yet available to buy.
                Send an enquiry and we can discuss availability and whether the
                planned course fits your learning goals.
              </p>
              <CourseEnquiryForm courseTitle={course.title} mode="launch" />
            </>
          )}
          <div className="agent-detail-sample">
            <h3>Try the learning approach</h3>
            <p>
              The Foundations sample includes six introductory lessons, practice
              questions and a workbook to help you write your instructions.
            </p>
            <Link href="/courses/always-on-agents-preview">
              Try the sample lessons <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
