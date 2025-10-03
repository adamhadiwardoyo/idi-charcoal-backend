import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PostList from "./PostList";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const SUPPORTED_LANGUAGES = ['EN', 'DE', 'AR', 'NL', 'ZH', 'FR', 'JA'];

const LANGUAGE_NAMES = {
  EN: 'English',
  DE: 'German',
  AR: 'Arabic',
  NL: 'Dutch',
  ZH: 'Chinese',
  FR: 'French',
  JA: 'Japanese'
};

// === FUNGSI YANG DIPERBAIKI ADA DI SINI ===
function groupByLanguage(posts) {
  // 1. Guard clause: Pastikan `posts` adalah array. Jika tidak, kembalikan objek kosong.
  if (!Array.isArray(posts)) {
    return {};
  }

  return posts.reduce((acc, post) => {
    // 2. Beri nilai fallback 'en' jika post.language tidak ada (undefined atau null)
    const lang = (post?.language || 'en').toUpperCase();

    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(post);
    return acc;
  }, {});
}
// =========================================

export default function TopicList({ groupedPosts, handlePrefill, ...postListProps }) {
  const sortedTopics = Object.keys(groupedPosts).sort((a, b) => {
    if (a === "Tanpa Topik") return 1;
    if (b === "Tanpa Topik") return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-6">
      {sortedTopics.map(topicName => {
        const posts = groupedPosts[topicName];
        const postsByLang = groupByLanguage(posts);
        const defaultTab = Object.keys(postsByLang)[0] || 'EN';

        return (
          <Card key={topicName}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {topicName}{" "}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({posts?.length || 0} post)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={defaultTab}>
                <p className="text-sm text-muted-foreground mb-3">
                  Pilih bahasa untuk melihat postingan yang tersedia:
                </p>
                <TabsList className="mb-4 flex flex-wrap gap-2 h-auto">
                  {SUPPORTED_LANGUAGES.map(lang => {
                    const isAvailable = postsByLang[lang] && postsByLang[lang].length > 0;

                    const languageTabClass = isAvailable
                      ? "data-[state=active]:bg-green-100 data-[state=active]:text-green-800 text-green-700 border-green-200"
                      : "data-[state=active]:bg-red-100 data-[state=active]:text-red-800 text-red-700 border-red-200";

                    return (
                      <TabsTrigger
                        key={lang}
                        value={lang}
                        className={languageTabClass}
                      >
                        {LANGUAGE_NAMES[lang] || lang}
                        <span className="text-xs ml-1.5 opacity-75 font-normal">
                          {isAvailable ? " (tersedia)" : " (tidak tersedia)"}
                        </span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {SUPPORTED_LANGUAGES.map(lang => {
                  const availablePosts = postsByLang[lang];

                  return (
                    <TabsContent key={lang} value={lang}>
                      {availablePosts ? (
                        <PostList
                          posts={availablePosts}
                          loading={false}
                          {...postListProps}
                        />
                      ) : (
                        <div className="text-center text-muted-foreground p-4 border rounded-md space-y-2">
                          <p>Belum ada postingan untuk bahasa '{LANGUAGE_NAMES[lang] || lang}'.</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrefill(topicName, lang.toLowerCase())}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Buat Postingan (Prefill)
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}