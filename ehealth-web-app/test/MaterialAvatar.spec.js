import { mount } from '@vue/test-utils'
import MaterialAvatar from "../src/components/MaterialAvatar";

describe('MaterialAvatar.vue', () => {
    it('Check basic initialisation', () => {
        const wrapper = mount(MaterialAvatar, {
            propsData: {
                accountDetails: {displayName: "Jack"},
                large: false
            }
        });
        expect(wrapper.isVueInstance()).toBeTruthy()
    });

    it('Check user initial present', () => {
        const wrapper = mount(MaterialAvatar, {
            propsData: {
                accountDetails: {displayName: "Jack"},
                large: false
            }
        });
        expect(wrapper.find("span").text().includes('J')).toBeTruthy();
        expect(wrapper.find('div').classes().includes('md-large')).toBeFalsy();
    });

    it('Check we can create a large icon', () => {
        const wrapper = mount(MaterialAvatar, {
            propsData: {
                accountDetails: {displayName: "Jack"},
                large: true
            }
        });
        expect(wrapper.find("span").text().includes('J')).toBeTruthy();
        expect(wrapper.find('div').classes().includes('md-large')).toBeTruthy();
    });

    it('Check we can create an icon with a photo', () => {
        const wrapper = mount(MaterialAvatar, {
            propsData: {
                accountDetails: {
                    displayName: "Jack",
                    photoUrl: "https://i.picsum.photos/id/0/100/100.jpg"
                },
                large: true
            }
        });
        expect(wrapper.find("span").exists()).toBeFalsy();
        expect(wrapper.find("img").exists()).toBeTruthy();
        expect(wrapper.find("img").attributes().src).toBe("https://i.picsum.photos/id/0/100/100.jpg");
    });
});
